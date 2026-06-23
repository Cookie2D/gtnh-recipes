import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Stack, Title, Text, Badge } from "@mantine/core";
import CalculatorClient from "@/components/calculator/CalculatorClient";
import { NEON, NEON_BORDER, NEON_DIM } from "@/lib/theme";

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
          Chain Resolver
        </Badge>
        <Title order={1} ff="var(--font-geist-mono)" fw={900} fz={28} style={{ color: "#f0fdf4" }}>
          Crafting <span style={{ color: NEON }}>Calculator</span>
        </Title>
        <Text fz="sm" mt={4} style={{ color: "#6b7280" }}>
          Enter a target item and quantity to resolve the full crafting chain.
        </Text>
      </div>
      <CalculatorClient
        recipeNames={recipeList.map((r) => r.name)}
        existingRecipes={recipeList}
        initialVariantPrefs={initialVariantPrefs}
      />
    </Stack>
  );
}
