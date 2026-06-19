"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Json } from "@/types/database";

export interface VariantInput {
  inputs: { item: string; quantity: number }[];
  machine: string;
}

export async function createRecipeAction(
  name: string,
  outputQuantity: number,
  variants: VariantInput[]
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({ user_id: user.id, name, output_item: name, output_quantity: outputQuantity })
    .select("id")
    .single();

  if (recipeError || !recipe) {
    const msg = recipeError?.message ?? "Failed to create recipe.";
    if (msg.includes("unique")) return { error: "A recipe with this name already exists." };
    return { error: msg };
  }

  const variantRows = variants.map((v, i) => ({
    recipe_id: recipe.id,
    variant_index: i,
    inputs: v.inputs as unknown as Json,
    machines: (v.machine ? [v.machine] : []) as unknown as Json,
  }));

  const { error: variantError } = await supabase.from("recipe_variants").insert(variantRows);
  if (variantError) return { error: variantError.message };

  revalidatePath("/recipes");
  return { id: recipe.id };
}

export async function updateRecipeAction(
  id: string,
  name: string,
  outputQuantity: number,
  variants: VariantInput[]
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error: updateError } = await supabase
    .from("recipes")
    .update({ name, output_item: name, output_quantity: outputQuantity, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) return { error: updateError.message };

  await supabase.from("recipe_variants").delete().eq("recipe_id", id);

  const variantRows = variants.map((v, i) => ({
    recipe_id: id,
    variant_index: i,
    inputs: v.inputs as unknown as Json,
    machines: (v.machine ? [v.machine] : []) as unknown as Json,
  }));

  const { error: variantError } = await supabase.from("recipe_variants").insert(variantRows);
  if (variantError) return { error: variantError.message };

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${id}/edit`);
  return {};
}

export async function deleteRecipeAction(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/recipes");
  return {};
}
