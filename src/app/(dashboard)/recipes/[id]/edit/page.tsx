import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Stack, Title, Text } from "@mantine/core";
import RecipeForm from "@/components/recipes/RecipeForm";
import { Json } from "@/types/database";
import { NEON } from "@/lib/theme";

interface RecipeRow {
  id: string;
  name: string;
  output_quantity: number;
  recipe_variants: {
    variant_index: number;
    inputs: Json;
    machines: Json;
  }[];
}

type AllRecipeRow = {
  id: string;
  name: string;
  recipe_variants: { inputs: { item: string; quantity: number }[] }[];
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data }, { data: allRecipesRaw }] = await Promise.all([
    supabase
      .from("recipes")
      .select("id, name, output_quantity, recipe_variants(variant_index, inputs, machines)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("recipes")
      .select("id, name, recipe_variants(inputs)")
      .eq("user_id", user.id),
  ]);

  if (!data) notFound();

  const recipe = data as unknown as RecipeRow;
  const allRecipes = (allRecipesRaw as unknown as AllRecipeRow[] | null) ?? [];

  const initialVariants = recipe.recipe_variants
    .sort((a, b) => a.variant_index - b.variant_index)
    .map((v) => ({
      inputs: v.inputs as { item: string; quantity: number }[],
      machine: (v.machines as string[])[0] ?? "",
    }));

  const existingRecipes = allRecipes.map((r) => ({ id: r.id, name: r.name }));
  const ingredientNames = Array.from(
    new Set(
      allRecipes
        .flatMap((r) => r.recipe_variants ?? [])
        .flatMap((v) => v.inputs ?? [])
        .map((inp) => inp.item?.trim())
        .filter((s): s is string => !!s)
    )
  );

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} ff="var(--font-geist-mono)" fw={900} fz={28} style={{ color: "#f0fdf4" }}>
          Edit <span style={{ color: NEON }}>{recipe.name}</span>
        </Title>
        <Text fz="sm" mt={4} style={{ color: "#6b7280" }}>
          Update ingredients, machine, or output quantity.
        </Text>
      </div>
      <RecipeForm
        recipeId={recipe.id}
        initialName={recipe.name}
        initialOutputQuantity={recipe.output_quantity}
        initialVariants={initialVariants}
        existingRecipes={existingRecipes}
        ingredientNames={ingredientNames}
      />
    </Stack>
  );
}
