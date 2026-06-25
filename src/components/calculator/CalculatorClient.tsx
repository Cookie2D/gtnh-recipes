"use client";

import {
  calculateAction,
  CalculateResult,
  loadVariantPrefs,
  saveVariantPref,
} from "@/app/actions/calculator";
import { Grid } from "@mantine/core";
import { useEffect, useState, useTransition } from "react";
import CraftingStepsPanel from "./CraftingStepsPanel";
import RawMaterialsPanel from "./RawMaterialsPanel";
import SearchPanel from "./SearchPanel";

export default function CalculatorClient() {
  const [isPending, startTransition] = useTransition();
  const [calculation, setCalculation] = useState<CalculateResult | null>(null);
  const [variantPrefs, setVariantPrefs] = useState<Record<string, number>>({});
  const [lastItem, setLastItem] = useState({ name: "", qty: 1 });

  useEffect(() => {
    loadVariantPrefs().then(setVariantPrefs);
  }, []);

  const handleCalculate = (
    item: string,
    qty: number,
    prefs: Record<string, number> = variantPrefs,
  ) => {
    startTransition(async () => {
      const res = await calculateAction(item, qty, prefs);
      if (!res.error) setCalculation(res);
    });
  };

  const handleSelectRecipe = (item: string, qty: number) => {
    setLastItem({ name: item, qty });
    handleCalculate(item, qty);
  };

  const handleVariantChange = (itemName: string, variantIndex: number) => {
    const newPrefs = { ...variantPrefs, [itemName]: variantIndex };
    setVariantPrefs(newPrefs);
    saveVariantPref(itemName, variantIndex);
    handleCalculate(lastItem.name, lastItem.qty, newPrefs);
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <SearchPanel onSelectRecipe={handleSelectRecipe} loading={isPending} />
      </Grid.Col>

      {calculation && (
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <RawMaterialsPanel
            rawMaterials={calculation.rawMaterials}
            quantity={lastItem.qty}
            itemName={lastItem.name}
          />
        </Grid.Col>
      )}

      {calculation && calculation.craftingSteps.length > 0 && (
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <CraftingStepsPanel
            key={`${lastItem.name}-${lastItem.qty}`}
            calculation={calculation}
            variantPrefs={variantPrefs}
            onVariantChange={handleVariantChange}
          />
        </Grid.Col>
      )}
    </Grid>
  );
}
