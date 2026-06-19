import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calculator, BookOpen, Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: recipesCount } = await supabase
    .from("recipes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: historyItems } = await supabase
    .from("calculation_history")
    .select("id, item_name, quantity, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5) as { data: { id: string; item_name: string; quantity: number; created_at: string }[] | null };

  const username = user.user_metadata?.username ?? user.email?.split("@")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Привіт, <span style={{ color: "var(--accent)" }}>{username}</span>!
        </h1>
        <p className="mt-1" style={{ color: "var(--muted)" }}>
          Твій центр управління рецептами і крафтами.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/calculator"
          className="flex items-center gap-4 p-5 rounded-xl border transition-colors hover:border-orange-500/50"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div
            className="p-3 rounded-lg"
            style={{ background: "var(--accent-dim)" }}
          >
            <Calculator size={24} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="font-semibold">Калькулятор</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Розрахувати крафт
            </p>
          </div>
        </Link>

        <Link
          href="/recipes/new"
          className="flex items-center gap-4 p-5 rounded-xl border transition-colors hover:border-orange-500/50"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div
            className="p-3 rounded-lg"
            style={{ background: "var(--accent-dim)" }}
          >
            <Plus size={24} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="font-semibold">Новий рецепт</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Додати до бази
            </p>
          </div>
        </Link>

        <Link
          href="/recipes"
          className="flex items-center gap-4 p-5 rounded-xl border transition-colors hover:border-orange-500/50"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div
            className="p-3 rounded-lg"
            style={{ background: "var(--accent-dim)" }}
          >
            <BookOpen size={24} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="font-semibold">Мої рецепти</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {recipesCount ?? 0} рецептів
            </p>
          </div>
        </Link>
      </div>

      {/* Recent calculations */}
      {historyItems && historyItems.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Останні розрахунки</h2>
          <div
            className="rounded-xl border divide-y"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            {historyItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium">{item.item_name}</p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    × {item.quantity}
                  </p>
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {new Date(item.created_at).toLocaleDateString("uk-UA")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
