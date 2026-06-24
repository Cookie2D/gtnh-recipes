import { Stack, Title, Badge } from "@mantine/core";
import RecipeForm from "@/components/recipes/RecipeForm";
import { requireUserId } from "@/lib/data/auth";
import { getRecipesWithVariants, extractIngredientNames } from "@/lib/data/recipes";

interface Props {
  searchParams: Promise<{ name?: string }>;
}

export default async function NewRecipePage({ searchParams }: Props) {
  const { name } = await searchParams;
  const userId = await requireUserId();
  const recipes = await getRecipesWithVariants(userId);

  const existingRecipes = recipes.map((r) => ({ id: r.id, name: r.name }));
  const ingredientNames = extractIngredientNames(recipes);

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
      <RecipeForm
        initialName={name ?? ""}
        existingRecipes={existingRecipes}
        ingredientNames={ingredientNames}
      />
    </Stack>
  );
}
