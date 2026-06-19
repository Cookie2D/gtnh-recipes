import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RecipeForm from "@/components/recipes/RecipeForm";

interface Props {
  searchParams: Promise<{ name?: string }>;
}

export default async function NewRecipePage({ searchParams }: Props) {
  const { name } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("recipes")
    .select("id, name")
    .eq("user_id", user.id) as { data: { id: string; name: string }[] | null };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Recipe</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Define what an item is made of and which machine produces it.
        </p>
      </div>
      <RecipeForm initialName={name ?? ""} existingRecipes={data ?? []} />
    </div>
  );
}
