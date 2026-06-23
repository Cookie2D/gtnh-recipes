import { requireUserId } from "@/lib/data/auth";
import { getRecipeList } from "@/lib/data/recipes";
import { NEON } from "@/lib/theme";
import { Box, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function RecipesPage() {
  const userId = await requireUserId();
  const recipes = await getRecipeList(userId);

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title
          order={1}
          ff="var(--font-geist-mono)"
          fw={900}
          fz={28}
          style={{ color: "#f0fdf4" }}
        >
          My Recipes
        </Title>
        <Link
          href="/recipes/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 18px",
            borderRadius: 8,
            fontFamily: "var(--font-geist-mono)",
            fontWeight: 700,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            textDecoration: "none",
            background: NEON,
            color: "#0a0a0a",
            boxShadow: "0 0 16px rgba(74,222,128,0.3)",
          }}
        >
          <Plus size={15} />
          New Recipe
        </Link>
      </Group>

      {recipes.length === 0 ? (
        <Box
          style={{
            borderRadius: 12,
            border: `1px solid rgba(255,255,255,0.07)`,
            background: "#141414",
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <Text fw={600} fz="lg" mb={6} style={{ color: "#f0fdf4" }}>
            No recipes yet
          </Text>
          <Text fz="sm" mb="lg" style={{ color: "#6b7280" }}>
            Add your first recipe to start calculating crafting chains
          </Text>
          <Link
            href="/recipes/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              borderRadius: 8,
              fontFamily: "var(--font-geist-mono)",
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              textDecoration: "none",
              background: NEON,
              color: "#0a0a0a",
            }}
          >
            <Plus size={15} />
            Add Recipe
          </Link>
        </Box>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}/edit`}
              className="neon-card"
              style={{ padding: "20px" }}
            >
              <Text
                fw={600}
                fz="sm"
                style={{
                  color: "#f0fdf4",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {recipe.name}
              </Text>
              <Text
                fz="xs"
                mt={4}
                ff="var(--font-geist-mono)"
                style={{ color: "#6b7280" }}
              >
                Outputs ×{recipe.output_quantity} · v{recipe.version}
              </Text>
            </Link>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
