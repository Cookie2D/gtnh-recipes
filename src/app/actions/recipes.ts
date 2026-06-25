"use server";

import { RecipeListItem } from "@/lib/data/recipes";
import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

const PAGE_SIZE = 39;

export interface RecipePage {
  items: RecipeListItem[];
  nextCursor: string | null;
}

export async function getRecipePageAction(
  cursor?: string,
): Promise<RecipePage> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { items: [], nextCursor: null };

  let query = supabase
    .from("recipes")
    .select("id, name, version, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(PAGE_SIZE + 1);

  if (cursor) {
    const { created_at, id } = JSON.parse(cursor) as {
      created_at: string;
      id: string;
    };
    query = query.or(
      `created_at.lt.${created_at},and(created_at.eq.${created_at},id.lt.${id})`,
    );
  }

  const { data } = await query;
  const items = (data as RecipeListItem[] | null) ?? [];

  const hasMore = items.length > PAGE_SIZE;
  if (hasMore) items.pop();

  const last = items[items.length - 1];
  const nextCursor =
    hasMore && last
      ? JSON.stringify({ created_at: last.created_at, id: last.id })
      : null;

  return { items, nextCursor };
}

export interface VariantInput {
  inputs: { item: string; quantity: number }[];
  machine: string;
  outputQuantity: number;
}

export async function createRecipeAction(
  name: string,
  variants: VariantInput[],
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .insert({ user_id: user.id, name, output_item: name })
    .select("id")
    .single();

  if (recipeError || !recipe) {
    const msg = recipeError?.message ?? "Failed to create recipe.";
    if (msg.includes("unique"))
      return { error: "A recipe with this name already exists." };
    return { error: msg };
  }

  const variantRows = variants.map((v, i) => ({
    recipe_id: recipe.id,
    variant_index: i,
    inputs: v.inputs as unknown as Json,
    machines: (v.machine ? [v.machine] : []) as unknown as Json,
    output_quantity: v.outputQuantity,
  }));

  const { error: variantError } = await supabase
    .from("recipe_variants")
    .insert(variantRows);
  if (variantError) return { error: variantError.message };

  revalidatePath("/recipes");
  return { id: recipe.id };
}

export async function updateRecipeAction(
  id: string,
  name: string,
  variants: VariantInput[],
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error: updateError } = await supabase
    .from("recipes")
    .update({ name, output_item: name, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) return { error: updateError.message };

  await supabase.from("recipe_variants").delete().eq("recipe_id", id);

  const variantRows = variants.map((v, i) => ({
    recipe_id: id,
    variant_index: i,
    inputs: v.inputs as unknown as Json,
    machines: (v.machine ? [v.machine] : []) as unknown as Json,
    output_quantity: v.outputQuantity,
  }));

  const { error: variantError } = await supabase
    .from("recipe_variants")
    .insert(variantRows);
  if (variantError) return { error: variantError.message };

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${id}/edit`);
  return {};
}

export async function deleteRecipeAction(
  id: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
