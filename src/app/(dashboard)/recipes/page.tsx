import { requireUserId } from "@/lib/data/auth";
import { getRecipeList } from "@/lib/data/recipes";
import { Group, SimpleGrid, Stack, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function RecipesPage() {
  const userId = await requireUserId();
  const recipes = await getRecipeList(userId);

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={1} className="page-title">My Recipes</Title>
        <Link href="/recipes/new" className="btn-neon">
          <Plus size={15} />
          New Recipe
        </Link>
      </Group>

      {recipes.length === 0 ? (
        <div className="empty-state-box">
          <p className="recipe-card-name" style={{ marginBottom: 6 }}>No recipes yet</p>
          <p className="page-subtitle" style={{ marginBottom: "var(--mantine-spacing-lg)" }}>
            Add your first recipe to start calculating crafting chains
          </p>
          <Link href="/recipes/new" className="btn-neon">
            <Plus size={15} />
            Add Recipe
          </Link>
        </div>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}/edit`}
              className="neon-card"
              style={{ padding: "20px" }}
            >
              <p className="recipe-card-name">{recipe.name}</p>
              <p className="recipe-card-meta">v{recipe.version}</p>
            </Link>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
