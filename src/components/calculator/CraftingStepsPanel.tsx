"use client";

import { useState } from "react";
import { Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Wrench } from "lucide-react";
import { CraftingStep } from "@/lib/calculator/engine";
import { VariantOptions } from "@/app/actions/calculator";
import CraftingStepCard from "./CraftingStepCard";

interface Props {
  craftingSteps: CraftingStep[];
  rawMaterials: Record<string, number>;
  recipeIndex: Map<string, string>;
  variantOptions: VariantOptions;
  variantPrefs: Record<string, number>;
  onVariantChange: (itemName: string, variantIndex: number) => void;
}

export default function CraftingStepsPanel({
  craftingSteps, rawMaterials, recipeIndex,
  variantOptions, variantPrefs, onVariantChange,
}: Props) {
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (item: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });

  const doneCount = craftingSteps.filter((s) => done.has(s.item)).length;

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <ThemeIcon variant="transparent" color="orange" size="sm">
          <Wrench size={16} />
        </ThemeIcon>
        <Text fw={600}>Crafting Steps</Text>
        <Text size="xs" c="dimmed">bottom-up order</Text>
        {doneCount > 0 && (
          <Text size="xs" c="green" ml="auto">
            {doneCount}/{craftingSteps.length} done
          </Text>
        )}
      </Group>

      <Stack gap="xs">
        {craftingSteps.map((step, i) => (
          <CraftingStepCard
            key={step.item}
            step={step}
            index={i}
            rawMaterials={rawMaterials}
            recipeIndex={recipeIndex}
            done={done.has(step.item)}
            onToggle={() => toggle(step.item)}
            variants={variantOptions[step.item]}
            selectedVariant={variantPrefs[step.item]}
            onVariantChange={(idx) => onVariantChange(step.item, idx)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
