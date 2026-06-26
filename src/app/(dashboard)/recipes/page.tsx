import RecipesInfiniteList from "@/components/recipes/RecipesInfiniteList";
import { Group, Stack, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function RecipesPage() {
  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Title order={1} className="page-title">My Recipes</Title>
        <Link href="/recipes/new" className="btn-neon">
          <Plus size={15} />
          New Recipe
        </Link>
      </Group>
      <RecipesInfiniteList />
    </Stack>
  );
}
