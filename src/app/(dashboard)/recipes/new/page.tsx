import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RecipeForm from "@/components/recipes/RecipeForm";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Recipe</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Define what an item is made of and which machine produces it.
        </p>
      </div>
      <RecipeForm
        initialName={name ?? ""}
        existingRecipes={existingRecipes}
        ingredientNames={ingredientNames}
      />
    </div>
  );
}
