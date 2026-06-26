import { Stack, Title, Badge, Skeleton } from "@mantine/core";
import RecipeForm from "@/components/recipes/RecipeForm";
import { getUserId } from "@/lib/data/auth";
import { getRecipesWithVariants, extractIngredientNames } from "@/lib/data/recipes";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ name?: string }>;
}

export default async function NewRecipePage({ searchParams }: Props) {
  const { name } = await searchParams;

  return (
    <Stack gap="xl">
      <div>
        <Badge variant="outline" className="page-badge">Recipe Builder</Badge>
        <Title order={1} className="page-title">
          New <span className="text-neon">Recipe</span>
        </Title>
        <p className="page-subtitle">
          Define what an item is made of and which machine produces it.
        </p>
      </div>
      <Suspense fallback={<RecipeFormSkeleton />}>
        <NewRecipeFormData initialName={name ?? ""} />
      </Suspense>
    </Stack>
  );
}

async function NewRecipeFormData({ initialName }: { initialName: string }) {
  const userId = await getUserId();
  const recipes = await getRecipesWithVariants(userId);
  const existingRecipes = recipes.map((r) => ({ id: r.id, name: r.name }));
  const ingredientNames = extractIngredientNames(recipes);

  return (
    <RecipeForm
      initialName={initialName}
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
