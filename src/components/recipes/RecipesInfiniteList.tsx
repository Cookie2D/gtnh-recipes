"use client";

import { getRecipePageAction } from "@/app/actions/recipes";
import { SimpleGrid, Skeleton, Stack } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

function RecipeCardSkeleton() {
  return (
    <div className="neon-card" style={{ padding: "20px" }}>
      <Skeleton height={18} width="60%" mb={10} />
      <Skeleton height={13} width="25%" />
    </div>
  );
}

function RecipeGridSkeleton({ count = 21 }: { count?: number }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
      {Array.from({ length: count }, (_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </SimpleGrid>
  );
}

export default function RecipesInfiniteList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["recipes"],
      queryFn: ({ pageParam }) => getRecipePageAction(pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  const { ref, entry } = useIntersection({ threshold: 0.1 });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const recipes = data?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) {
    return <RecipeGridSkeleton />;
  }

  if (recipes.length === 0) {
    return (
      <div className="empty-state-box">
        <p className="recipe-card-name" style={{ marginBottom: 6 }}>
          No recipes yet
        </p>
        <p
          className="page-subtitle"
          style={{ marginBottom: "var(--mantine-spacing-lg)" }}
        >
          Add your first recipe to start calculating crafting chains
        </p>
        <Link href="/recipes/new" className="btn-neon">
          <Plus size={15} />
          Add Recipe
        </Link>
      </div>
    );
  }

  return (
    <Stack gap="sm">
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

      <div ref={ref} style={{ height: 1 }} />

      {isFetchingNextPage && <RecipeGridSkeleton count={3} />}
    </Stack>
  );
}
