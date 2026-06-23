import { Stack, Title, Text, Badge } from "@mantine/core";
import CalculatorClient from "@/components/calculator/CalculatorClient";
import { requireUserId } from "@/lib/data/auth";
import { getRecipeSummaries } from "@/lib/data/recipes";
import { getVariantPrefs } from "@/lib/data/calculator";
import { NEON, NEON_BORDER, NEON_DIM } from "@/lib/theme";

export default async function CalculatorPage() {
  const userId = await requireUserId();
  const [recipeList, initialVariantPrefs] = await Promise.all([
    getRecipeSummaries(userId),
    getVariantPrefs(userId),
  ]);

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
