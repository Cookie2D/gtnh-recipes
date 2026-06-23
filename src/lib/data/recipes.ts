import { createClient } from "@/lib/supabase/server";
import { Json } from "@/types/database";

export type RecipeSummary = {
  id: string;
  name: string;
};

export type RecipeListItem = {
  id: string;
  name: string;
  output_quantity: number;
  version: string;
  created_at: string;
};

export type RecipeWithVariants = {
  id: string;
  name: string;
  recipe_variants: { inputs: { item: string; quantity: number }[] }[];
};

export type RecipeDetail = {
  id: string;
  name: string;
  output_quantity: number;
  recipe_variants: {
    variant_index: number;
    inputs: Json;
    machines: Json;
  }[];
};

export async function getRecipesCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("recipes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

export async function getRecipeList(userId: string): Promise<RecipeListItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("id, name, output_quantity, version, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as RecipeListItem[] | null) ?? [];
}

export async function getRecipeSummaries(userId: string): Promise<RecipeSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("id, name")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as RecipeSummary[] | null) ?? [];
}

export async function getRecipesWithVariants(userId: string): Promise<RecipeWithVariants[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("id, name, recipe_variants(inputs)")
    .eq("user_id", userId);
  return (data as RecipeWithVariants[] | null) ?? [];
}

export async function getRecipeById(id: string, userId: string): Promise<RecipeDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("id, name, output_quantity, recipe_variants(variant_index, inputs, machines)")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  return (data as RecipeDetail | null);
}

export function extractIngredientNames(recipes: RecipeWithVariants[]): string[] {
  return Array.from(
    new Set(
      recipes
        .flatMap((r) => r.recipe_variants ?? [])
        .flatMap((v) => v.inputs ?? [])
        .map((inp) => inp.item?.trim())
        .filter((s): s is string => !!s)
    )
  );
}
