"use client";

import { useState } from "react";
import { Grid } from "@mantine/core";
import { calculateAction } from "@/app/actions/calculator";
import { CraftingStep } from "@/lib/calculator/engine";
import { ExistingRecipe } from "@/types";
import { buildRecipeIndex } from "@/components/ui/ItemLink";
import ItemSearch from "./ItemSearch";
import RawMaterialsPanel from "./RawMaterialsPanel";
import CraftingStepsPanel from "./CraftingStepsPanel";

interface Props {
  recipeNames: string[];
  existingRecipes: ExistingRecipe[];
}

export default function CalculatorClient({ recipeNames, existingRecipes }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawMaterials, setRawMaterials] = useState<Record<string, number> | null>(null);
  const [craftingSteps, setCraftingSteps] = useState<CraftingStep[] | null>(null);
  const [lastItem, setLastItem] = useState({ name: "", qty: 1 });

  const recipeIndex = buildRecipeIndex(existingRecipes);

  const handleCalculate = async (item: string, quantity: number) => {
    setError("");
    setLoading(true);
    setRawMaterials(null);
    setCraftingSteps(null);
    setLastItem({ name: item, qty: quantity });

    const result = await calculateAction(item, quantity);

    if (result.error) {
      setError(result.error);
    } else {
      setRawMaterials(result.rawMaterials ?? null);
      setCraftingSteps(result.craftingSteps ?? null);
    }
    setLoading(false);
  };

  const hasResults = rawMaterials !== null && craftingSteps !== null;

  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <ItemSearch
          recipeNames={recipeNames}
          loading={loading}
          error={error}
          onCalculate={handleCalculate}
        />
      </Grid.Col>

      {hasResults && (
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <RawMaterialsPanel
            rawMaterials={rawMaterials!}
            quantity={lastItem.qty}
            itemName={lastItem.name}
            recipeIndex={recipeIndex}
          />
        </Grid.Col>
      )}

      {hasResults && craftingSteps!.length > 0 && (
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <CraftingStepsPanel
            craftingSteps={craftingSteps!}
            rawMaterials={rawMaterials!}
            recipeIndex={recipeIndex}
          />
        </Grid.Col>
      )}
    </Grid>
  );
}
