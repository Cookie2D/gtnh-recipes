"use server";

import { createClient } from "@/lib/supabase/server";
import { calculate, RecipeMap, CalculationResult } from "@/lib/calculator/engine";
import { Json } from "@/types/database";

interface RecipeRow {
  name: string;
  output_quantity: number;
  recipe_variants: {
    variant_index: number;
    inputs: Json;
    machines: Json;
  }[];
}

export async function calculateAction(
  itemName: string,
  quantity: number
): Promise<CalculationResult & { error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated.", rawMaterials: {}, craftingSteps: [] };

  const { data: recipes, error: fetchError } = await supabase
    .from("recipes")
    .select("name, output_quantity, recipe_variants(variant_index, inputs, machines)")
    .eq("user_id", user.id);

  if (fetchError || !recipes) {
    return { error: fetchError?.message ?? "Failed to load recipes.", rawMaterials: {}, craftingSteps: [] };
  }

  const typedRecipes = recipes as unknown as RecipeRow[];

  const recipeMap: RecipeMap = {};
  for (const r of typedRecipes) {
    const sorted = [...r.recipe_variants].sort((a, b) => a.variant_index - b.variant_index);
    const variant = sorted[0];
    if (!variant) continue;

    const inputs = variant.inputs as { item: string; quantity: number }[];
    const machines = variant.machines as string[];

    recipeMap[r.name] = {
      outputQuantity: r.output_quantity,
      inputs,
      machine: machines[0] ?? "",
    };
  }

  let result: CalculationResult;
  try {
    result = calculate(itemName, quantity, recipeMap);
  } catch (err) {
    return { error: (err as Error).message, rawMaterials: {}, craftingSteps: [] };
  }

  // Save to history (non-blocking)
  supabase.from("calculation_history").insert({
    user_id: user.id,
    item_name: itemName,
    quantity,
    raw_materials: result.rawMaterials as unknown as Json,
    crafting_steps: result.craftingSteps as unknown as Json,
  }).then(() => {});

  return result;
}
