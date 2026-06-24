import { notFound } from "next/navigation";
import { Stack, Title, Text } from "@mantine/core";
import RecipeForm from "@/components/recipes/RecipeForm";
import { Json } from "@/types/database";
import { requireUserId } from "@/lib/data/auth";
import { getRecipeById, getRecipesWithVariants, extractIngredientNames } from "@/lib/data/recipes";
import { NEON } from "@/lib/theme";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const userId = await requireUserId();

  const [recipe, allRecipes] = await Promise.all([
    getRecipeById(id, userId),
    getRecipesWithVariants(userId),
  ]);

  if (!recipe) notFound();

  const initialVariants = recipe.recipe_variants
    .sort((a, b) => a.variant_index - b.variant_index)
    .map((v) => ({
      inputs: v.inputs as { item: string; quantity: number }[],
      machine: (v.machines as string[])[0] ?? "",
      outputQuantity: v.output_quantity,
    }));

  const existingRecipes = allRecipes.map((r) => ({ id: r.id, name: r.name }));
  const ingredientNames = extractIngredientNames(allRecipes);

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
        initialVariants={initialVariants}
        existingRecipes={existingRecipes}
        ingredientNames={ingredientNames}
      />
    </Stack>
  );
}
