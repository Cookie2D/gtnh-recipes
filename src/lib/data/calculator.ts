import { createClient } from "@/lib/supabase/server";

export type VariantPref = {
  item_name: string;
  variant_index: number;
};

export async function getVariantPrefs(userId: string): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_variant_prefs")
    .select("item_name, variant_index")
    .eq("user_id", userId);

  const prefs: Record<string, number> = {};
  for (const row of (data as VariantPref[] | null) ?? []) {
    prefs[row.item_name] = row.variant_index;
  }
  return prefs;
}
