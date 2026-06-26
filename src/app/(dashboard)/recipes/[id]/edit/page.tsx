import RecipeForm from "@/components/recipes/RecipeForm";
import { requireUserId } from "@/lib/data/auth";
import {
  extractIngredientNames,
  getRecipeById,
  getRecipesWithVariants,
} from "@/lib/data/recipes";
import { Stack, Title, Skeleton } from "@mantine/core";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} className="page-title">
          Edit <span className="text-neon">Recipe</span>
        </Title>
        <p className="page-subtitle">
          Update ingredients, machine, or output quantity.
        </p>
      </div>
      <Suspense fallback={<RecipeFormSkeleton />}>
        <EditRecipeFormData id={id} />
      </Suspense>
    </Stack>
  );
}

async function EditRecipeFormData({ id }: { id: string }) {
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
    <RecipeForm
      recipeId={recipe.id}
      initialName={recipe.name}
      initialVariants={initialVariants}
      existingRecipes={existingRecipes}
      ingredientNames={ingredientNames}
    />
  );
}

function RecipeFormSkeleton() {
  return (
    <Stack gap="md">
      <Skeleton height={40} radius="sm" />
      <Skeleton height={40} radius="sm" />
      <Skeleton height={120} radius="sm" />
      <Skeleton height={40} width={120} radius="sm" />
    </Stack>
  );
}
