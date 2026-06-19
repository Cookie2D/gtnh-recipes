import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CalculatorClient from "@/components/calculator/CalculatorClient";

export default async function CalculatorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: recipes } = await supabase
    .from("recipes")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name") as { data: { id: string; name: string }[] | null };

  const recipeList = recipes ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Crafting Calculator</h1>
      <CalculatorClient
        recipeNames={recipeList.map((r) => r.name)}
        existingRecipes={recipeList}
      />
    </div>
  );
}
