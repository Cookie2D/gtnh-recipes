import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function RecipesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: recipes } = await supabase
    .from("recipes")
    .select("id, name, output_quantity, version, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }) as {
      data: { id: string; name: string; output_quantity: number; version: string; created_at: string }[] | null;
    };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Мої рецепти</h1>
        <Link
          href="/recipes/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          <Plus size={16} />
          Новий рецепт
        </Link>
      </div>

      {!recipes || recipes.length === 0 ? (
        <div
          className="rounded-xl border p-12 text-center"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <p className="text-lg font-medium mb-2">Рецептів ще немає</p>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            Додай перший рецепт, щоб почати розраховувати крафти
          </p>
          <Link
            href="/recipes/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            <Plus size={16} />
            Додати рецепт
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}/edit`}
              className="block p-5 rounded-xl border transition-colors hover:border-orange-500/50"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p className="font-semibold truncate">{recipe.name}</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                Виробляє: ×{recipe.output_quantity} · v{recipe.version}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
