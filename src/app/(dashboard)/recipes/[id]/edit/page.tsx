import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import RecipeForm from "@/components/recipes/RecipeForm";
import { Json } from "@/types/database";

interface RecipeRow {
  id: string;
  name: string;
  output_quantity: number;
  recipe_variants: {
    variant_index: number;
    inputs: Json;
    machines: Json;
  }[];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("recipes")
    .select("id, name, output_quantity, recipe_variants(variant_index, inputs, machines)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!data) notFound();

  const recipe = data as unknown as RecipeRow;

  const initialVariants = recipe.recipe_variants
    .sort((a, b) => a.variant_index - b.variant_index)
    .map((v) => ({
      inputs: v.inputs as { item: string; quantity: number }[],
      machine: (v.machines as string[])[0] ?? "",
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Recipe</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          {recipe.name}
        </p>
      </div>
      <RecipeForm
        recipeId={recipe.id}
        initialName={recipe.name}
        initialOutputQuantity={recipe.output_quantity}
        initialVariants={initialVariants}
      />
    </div>
  );
}
