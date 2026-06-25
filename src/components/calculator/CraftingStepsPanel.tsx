"use client";

import { VariantOptions } from "@/app/actions/calculator";
import { EnrichedCraftingStep } from "@/types";
import { Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Wrench } from "lucide-react";
import { useState } from "react";
import CraftingStepCard from "./CraftingStepCard";

interface Props {
  craftingSteps: EnrichedCraftingStep[];
  rawMaterials: Record<string, number>;
  variantOptions: VariantOptions;
  variantPrefs: Record<string, number>;
  onVariantChange: (itemName: string, variantIndex: number) => void;
}

export default function CraftingStepsPanel({
  craftingSteps,
  rawMaterials,
  variantOptions,
  variantPrefs,
  onVariantChange,
}: Props) {
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (name: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const doneCount = craftingSteps.filter((s) => done.has(s.item.name)).length;

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <ThemeIcon variant="transparent" color="orange" size="sm">
          <Wrench size={16} />
        </ThemeIcon>
        <Text fw={600}>Crafting Steps</Text>
        {doneCount > 0 && (
          <Text size="xs" c="green" ml="auto">
            {doneCount}/{craftingSteps.length} done
          </Text>
        )}
      </Group>

      <Stack gap="xs">
        {craftingSteps.map((step, i) => (
          <CraftingStepCard
            key={step.item.name}
            step={step}
            index={i}
            rawMaterials={rawMaterials}
            done={done.has(step.item.name)}
            onToggle={() => toggle(step.item.name)}
            variants={variantOptions[step.item.name]}
            selectedVariant={variantPrefs[step.item.name]}
            onVariantChange={(idx) => onVariantChange(step.item.name, idx)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
