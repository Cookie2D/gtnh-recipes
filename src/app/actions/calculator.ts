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

export interface VariantOption {
  variantIndex: number;
  label: string;
}

export type VariantOptions = Record<string, VariantOption[]>;

export interface CalculateResult extends CalculationResult {
  error?: string;
  variantOptions: VariantOptions;
}

export async function calculateAction(
  itemName: string,
  quantity: number,
  variantPrefs: Record<string, number> = {}
): Promise<CalculateResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated.", rawMaterials: {}, craftingSteps: [], variantOptions: {} };

  const { data: recipes, error: fetchError } = await supabase
    .from("recipes")
    .select("name, output_quantity, recipe_variants(variant_index, inputs, machines)")
    .eq("user_id", user.id);

  if (fetchError || !recipes) {
    return { error: fetchError?.message ?? "Failed to load recipes.", rawMaterials: {}, craftingSteps: [], variantOptions: {} };
  }

  const typedRecipes = recipes as unknown as RecipeRow[];

  const recipeMap: RecipeMap = {};
  const variantOptions: VariantOptions = {};

  for (const r of typedRecipes) {
    const sorted = [...r.recipe_variants].sort((a, b) => a.variant_index - b.variant_index);
    if (sorted.length === 0) continue;

    // Build available options for this recipe (used by UI to render variant selectors)
    if (sorted.length > 1) {
      variantOptions[r.name] = sorted.map((v) => {
        const machines = v.machines as string[];
        const machine = machines[0] ?? "";
        return { variantIndex: v.variant_index, label: machine || "Manual" };
      });
    }

    // Pick the preferred variant (default: first / lowest variant_index)
    const preferredIndex = variantPrefs[r.name] ?? sorted[0].variant_index;
    const variant = sorted.find((v) => v.variant_index === preferredIndex) ?? sorted[0];

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
    return { error: (err as Error).message, rawMaterials: {}, craftingSteps: [], variantOptions };
  }

  // Save to history (non-blocking)
  supabase.from("calculation_history").insert({
    user_id: user.id,
    item_name: itemName,
    quantity,
    raw_materials: result.rawMaterials as unknown as Json,
    crafting_steps: result.craftingSteps as unknown as Json,
  }).then(() => {});

  return { ...result, variantOptions };
}

export async function saveVariantPref(itemName: string, variantIndex: number): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_variant_prefs").upsert(
    { user_id: user.id, item_name: itemName, variant_index: variantIndex, updated_at: new Date().toISOString() },
    { onConflict: "user_id,item_name" }
  );
}

export async function loadVariantPrefs(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("user_variant_prefs")
    .select("item_name, variant_index")
    .eq("user_id", user.id);

  const prefs: Record<string, number> = {};
  for (const row of data ?? []) {
    prefs[row.item_name] = row.variant_index;
  }
  return prefs;
}
