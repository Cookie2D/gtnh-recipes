import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CalculatorClient from "@/components/calculator/CalculatorClient";

export default async function CalculatorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [recipesResult, prefsResult] = await Promise.all([
    supabase
      .from("recipes")
      .select("id, name")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_variant_prefs")
      .select("item_name, variant_index")
      .eq("user_id", user.id),
  ]);

  const recipeList = (recipesResult.data as { id: string; name: string }[] | null) ?? [];

  const initialVariantPrefs: Record<string, number> = {};
  for (const row of prefsResult.data ?? []) {
    initialVariantPrefs[row.item_name] = row.variant_index;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Crafting Calculator</h1>
      <CalculatorClient
        recipeNames={recipeList.map((r) => r.name)}
        existingRecipes={recipeList}
        initialVariantPrefs={initialVariantPrefs}
      />
    </div>
  );
}
