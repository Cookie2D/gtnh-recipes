"use client";

import { calculateAction, VariantOptions } from "@/app/actions/calculator";
import { buildRecipeIndex } from "@/components/ui/ItemLink";
import { CraftingStep } from "@/lib/calculator/engine";
import { ExistingRecipe } from "@/types";
import { Grid } from "@mantine/core";
import { useState } from "react";
import CraftingStepsPanel from "./CraftingStepsPanel";
import ItemSearch from "./ItemSearch";
import RawMaterialsPanel from "./RawMaterialsPanel";

interface Props {
  recipeNames: string[];
  existingRecipes: ExistingRecipe[];
}

export default function CalculatorClient({ recipeNames, existingRecipes }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawMaterials, setRawMaterials] = useState<Record<string, number> | null>(null);
  const [craftingSteps, setCraftingSteps] = useState<CraftingStep[] | null>(null);
  const [variantOptions, setVariantOptions] = useState<VariantOptions>({});
  const [variantPrefs, setVariantPrefs] = useState<Record<string, number>>({});
  const [lastItem, setLastItem] = useState({ name: "", qty: 1 });

  const recipeIndex = buildRecipeIndex(existingRecipes);

  const handleCalculate = async (
    item: string,
    quantity: number,
    prefs: Record<string, number> = variantPrefs,
  ) => {
    setError("");
    setLoading(true);
    setRawMaterials(null);
    setCraftingSteps(null);

    const result = await calculateAction(item, quantity, prefs);

    if (result.error) {
      setError(result.error);
    } else {
      setRawMaterials(result.rawMaterials ?? null);
      setCraftingSteps(result.craftingSteps ?? null);
      setVariantOptions(result.variantOptions ?? {});
    }
    setLoading(false);
  };

  const handleNewCalculation = (item: string, quantity: number) => {
    setVariantPrefs({});
    setLastItem({ name: item, qty: quantity });
    handleCalculate(item, quantity, {});
  };

  const handleVariantChange = (itemName: string, variantIndex: number) => {
    const newPrefs = { ...variantPrefs, [itemName]: variantIndex };
    setVariantPrefs(newPrefs);
    handleCalculate(lastItem.name, lastItem.qty, newPrefs);
  };

  const hasResults = rawMaterials !== null && craftingSteps !== null;

  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <ItemSearch
          recipeNames={recipeNames}
          loading={loading}
          error={error}
          onCalculate={handleNewCalculation}
        />
      </Grid.Col>

      {hasResults && (
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <RawMaterialsPanel
            rawMaterials={rawMaterials!}
            quantity={lastItem.qty}
            itemName={lastItem.name}
          />
        </Grid.Col>
      )}

      {hasResults && craftingSteps!.length > 0 && (
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <CraftingStepsPanel
            key={`${lastItem.name}-${lastItem.qty}`}
            craftingSteps={craftingSteps!}
            rawMaterials={rawMaterials!}
            recipeIndex={recipeIndex}
            variantOptions={variantOptions}
            variantPrefs={variantPrefs}
            onVariantChange={handleVariantChange}
          />
        </Grid.Col>
      )}
    </Grid>
  );
}
