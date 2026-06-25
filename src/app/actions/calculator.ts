"use server";

import {
  calculate,
  RecipeMap,
} from "@/lib/calculator/engine";
import { createClient } from "@/lib/supabase/server";
import { EnrichedCraftingStep } from "@/types";
import { Json } from "@/types/database";

interface RecipeRow {
  id: string;
  name: string;
  recipe_variants: {
    variant_index: number;
    inputs: Json;
    machines: Json;
    output_quantity: number;
  }[];
}

export interface VariantOption {
  variantIndex: number;
  label: string;
}

export type VariantOptions = Record<string, VariantOption[]>;

export interface CalculateResult {
  error?: string;
  rawMaterials: Record<string, number>;
  craftingSteps: EnrichedCraftingStep[];
  variantOptions: VariantOptions;
}

export async function calculateAction(
  itemName: string,
  quantity: number,
  variantPrefs: Record<string, number> = {},
): Promise<CalculateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      error: "Not authenticated.",
      rawMaterials: {},
      craftingSteps: [],
      variantOptions: {},
    };

  const { data: recipes, error: fetchError } = await supabase
    .from("recipes")
    .select(
      "id, name, recipe_variants(variant_index, inputs, machines, output_quantity)",
    )
    .eq("user_id", user.id);

  if (fetchError || !recipes) {
    return {
      error: fetchError?.message ?? "Failed to load recipes.",
      rawMaterials: {},
      craftingSteps: [],
      variantOptions: {},
    };
  }

  const typedRecipes = recipes as unknown as RecipeRow[];
  const nameToId = new Map(typedRecipes.map((r) => [r.name, r.id]));

  const recipeMap: RecipeMap = {};
  const variantOptions: VariantOptions = {};

  for (const r of typedRecipes) {
    const sorted = [...r.recipe_variants].sort(
      (a, b) => a.variant_index - b.variant_index,
    );
    if (sorted.length === 0) continue;

    if (sorted.length > 1) {
      variantOptions[r.name] = sorted.map((v) => {
        const machines = v.machines as string[];
        const machine = machines[0] ?? "";
        return { variantIndex: v.variant_index, label: machine || "Manual" };
      });
    }

    const preferredIndex = variantPrefs[r.name] ?? sorted[0].variant_index;
    const variant =
      sorted.find((v) => v.variant_index === preferredIndex) ?? sorted[0];

    const inputs = variant.inputs as { item: string; quantity: number }[];
    const machines = variant.machines as string[];

    recipeMap[r.name] = {
      outputQuantity: variant.output_quantity,
      inputs,
      machine: machines[0] ?? "",
    };
  }

  let rawResult;
  try {
    rawResult = calculate(itemName, quantity, recipeMap);
  } catch (err) {
    return {
      error: (err as Error).message,
      rawMaterials: {},
      craftingSteps: [],
      variantOptions,
    };
  }

  const craftingSteps: EnrichedCraftingStep[] = rawResult.craftingSteps.map((step) => ({
    ...step,
    item: { name: step.item, id: nameToId.get(step.item) },
    inputs: step.inputs.map((inp) => ({
      ...inp,
      item: { name: inp.item, id: nameToId.get(inp.item) },
    })),
  }));

  // Save to history (non-blocking)
  supabase
    .from("calculation_history")
    .insert({
      user_id: user.id,
      item_name: itemName,
      quantity,
      raw_materials: rawResult.rawMaterials as unknown as Json,
      crafting_steps: rawResult.craftingSteps as unknown as Json,
    })
    .then(() => {});

  return { rawMaterials: rawResult.rawMaterials, craftingSteps, variantOptions };
}

export async function saveVariantPref(
  itemName: string,
  variantIndex: number,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("user_variant_prefs").upsert(
    {
      user_id: user.id,
      item_name: itemName,
      variant_index: variantIndex,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,item_name" },
  );
}

export async function loadVariantPrefs(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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

export interface RecipeSummary {
  id: string;
  name: string;
}

export interface SearchRecipesResult {
  items: RecipeSummary[];
  total: number;
  page: number;
  hasMore: boolean;
}

export async function searchRecipes(
  query: string,
  page: number = 0,
  pageSize: number = 10,
): Promise<SearchRecipesResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { items: [], total: 0, page, hasMore: false };

  // Fetch total count
  const { count } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .ilike("name", `%${query}%`);

  const total = count ?? 0;

  // Fetch paginated results
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("id, name")
    .eq("user_id", user.id)
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true })
    .range(page * pageSize, page * pageSize + pageSize - 1);

  if (error || !recipes) {
    return { items: [], total: 0, page, hasMore: false };
  }

  const items = recipes as RecipeSummary[];
  const hasMore = (page + 1) * pageSize < total;

  return { items, total, page, hasMore };
}

export interface RecentRecipesResult {
  items: RecipeSummary[];
  variantOptions: VariantOptions;
}

export async function getRecentRecipesWithVariants(
  limit: number = 10,
): Promise<RecentRecipesResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { items: [], variantOptions: {} };

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("id, name, recipe_variants(variant_index, machines)")
    .eq("user_id", user.id)
    .order("name", { ascending: true })
    .limit(limit);

  if (error || !recipes) {
    return { items: [], variantOptions: {} };
  }

  const typedRecipes = recipes as unknown as (RecipeRow & { id: string })[];
  const items: RecipeSummary[] = [];
  const variantOptions: VariantOptions = {};

  for (const r of typedRecipes) {
    items.push({ id: r.id, name: r.name });

    const sorted = [...r.recipe_variants].sort(
      (a, b) => a.variant_index - b.variant_index,
    );
    if (sorted.length > 1) {
      variantOptions[r.name] = sorted.map((v) => {
        const machines = v.machines as string[];
        const machine = machines[0] ?? "";
        return { variantIndex: v.variant_index, label: machine || "Manual" };
      });
    }
  }

  return { items, variantOptions };
}
