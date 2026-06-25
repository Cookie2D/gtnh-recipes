"use client";

import {
  calculateAction,
  loadVariantPrefs,
  saveVariantPref,
  VariantOptions,
} from "@/app/actions/calculator";
import { EnrichedCraftingStep } from "@/types";
import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import CraftingStepsPanel from "./CraftingStepsPanel";
import RawMaterialsPanel from "./RawMaterialsPanel";
import SearchPanel from "./SearchPanel";

export default function CalculatorClient() {
  const [loading, setLoading] = useState(false);
  const [rawMaterials, setRawMaterials] = useState<Record<string, number> | null>(null);
  const [craftingSteps, setCraftingSteps] = useState<EnrichedCraftingStep[] | null>(null);
  const [variantOptions, setVariantOptions] = useState<VariantOptions>({});
  const [variantPrefs, setVariantPrefs] = useState<Record<string, number>>({});
  const [lastItem, setLastItem] = useState({ name: "", qty: 1 });

  useEffect(() => {
    loadVariantPrefs().then(setVariantPrefs);
  }, []);

  const handleCalculate = async (
    item: string,
    quantity: number,
    prefs: Record<string, number> = variantPrefs,
  ) => {
    setLoading(true);
    setRawMaterials(null);
    setCraftingSteps(null);

    const result = await calculateAction(item, quantity, prefs);

    if (!result.error) {
      setRawMaterials(result.rawMaterials ?? null);
      setCraftingSteps(result.craftingSteps ?? null);
      setVariantOptions(result.variantOptions ?? {});
    }
    setLoading(false);
  };

  const handleSelectRecipe = (item: string, quantity: number) => {
    setLastItem({ name: item, qty: quantity });
    handleCalculate(item, quantity, variantPrefs);
  };

  const handleVariantChange = (itemName: string, variantIndex: number) => {
    const newPrefs = { ...variantPrefs, [itemName]: variantIndex };
    setVariantPrefs(newPrefs);
    saveVariantPref(itemName, variantIndex);
    handleCalculate(lastItem.name, lastItem.qty, newPrefs);
  };

  const hasResults = rawMaterials !== null && craftingSteps !== null;

  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <SearchPanel onSelectRecipe={handleSelectRecipe} loading={loading} />
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
            variantOptions={variantOptions}
            variantPrefs={variantPrefs}
            onVariantChange={handleVariantChange}
          />
        </Grid.Col>
      )}
    </Grid>
  );
}
