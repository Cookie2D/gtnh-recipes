import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Stack, Title, Text, Badge } from "@mantine/core";
import RecipeForm from "@/components/recipes/RecipeForm";
import { NEON, NEON_BORDER, NEON_DIM } from "@/lib/theme";

interface Props {
  searchParams: Promise<{ name?: string }>;
}

type RecipeRow = {
  id: string;
  name: string;
  recipe_variants: { inputs: { item: string; quantity: number }[] }[];
};

export default async function NewRecipePage({ searchParams }: Props) {
  const { name } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("recipes")
    .select("id, name, recipe_variants(inputs)")
    .eq("user_id", user.id) as { data: RecipeRow[] | null };

  const recipes = data ?? [];
  const existingRecipes = recipes.map((r) => ({ id: r.id, name: r.name }));
  const ingredientNames = Array.from(
    new Set(
      recipes
        .flatMap((r) => r.recipe_variants ?? [])
        .flatMap((v) => v.inputs ?? [])
        .map((inp) => inp.item?.trim())
        .filter((s): s is string => !!s)
    )
  );

  return (
    <Stack gap="xl">
      <div>
        <Badge
          variant="outline"
          mb="sm"
          style={{
            color: NEON,
            background: NEON_DIM,
            borderColor: NEON_BORDER,
            fontFamily: "var(--font-geist-mono)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: 11,
          }}
        >
          Recipe Builder
        </Badge>
        <Title order={1} ff="var(--font-geist-mono)" fw={900} fz={28} style={{ color: "#f0fdf4" }}>
          New <span style={{ color: NEON }}>Recipe</span>
        </Title>
        <Text fz="sm" mt={4} style={{ color: "#6b7280" }}>
          Define what an item is made of and which machine produces it.
        </Text>
      </div>
      <RecipeForm
        initialName={name ?? ""}
        existingRecipes={existingRecipes}
        ingredientNames={ingredientNames}
      />
    </Stack>
  );
}
