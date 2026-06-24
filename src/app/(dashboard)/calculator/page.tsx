import { Stack, Title, Badge } from "@mantine/core";
import CalculatorClient from "@/components/calculator/CalculatorClient";
import { requireUserId } from "@/lib/data/auth";
import { getRecipeSummaries } from "@/lib/data/recipes";
import { getVariantPrefs } from "@/lib/data/calculator";

export default async function CalculatorPage() {
  const userId = await requireUserId();
  const [recipeList, initialVariantPrefs] = await Promise.all([
    getRecipeSummaries(userId),
    getVariantPrefs(userId),
  ]);

  return (
    <Stack gap="xl">
      <div>
        <Badge variant="outline" className="page-badge">Chain Resolver</Badge>
        <Title order={1} className="page-title">
          Crafting <span className="text-neon">Calculator</span>
        </Title>
        <p className="page-subtitle">
          Enter a target item and quantity to resolve the full crafting chain.
        </p>
      </div>
      <CalculatorClient
        recipeNames={recipeList.map((r) => r.name)}
        existingRecipes={recipeList}
        initialVariantPrefs={initialVariantPrefs}
      />
    </Stack>
  );
}
