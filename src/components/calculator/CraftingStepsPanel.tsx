"use client";

import { useState } from "react";
import { Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Wrench } from "lucide-react";
import { CraftingStep } from "@/lib/calculator/engine";
import CraftingStepCard from "./CraftingStepCard";

interface Props {
  craftingSteps: CraftingStep[];
  rawMaterials: Record<string, number>;
  recipeIndex: Map<string, string>;
}

export default function CraftingStepsPanel({ craftingSteps, rawMaterials, recipeIndex }: Props) {
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (item: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });

  // No-machine steps (manual crafting) first, then machine steps — stable sort
  const sorted = [...craftingSteps].sort((a, b) => {
    const aHas = !!a.machine;
    const bHas = !!b.machine;
    if (aHas === bHas) return 0;
    return aHas ? 1 : -1;
  });

  const doneCount = sorted.filter((s) => done.has(s.item)).length;

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <ThemeIcon variant="transparent" color="orange" size="sm">
          <Wrench size={16} />
        </ThemeIcon>
        <Text fw={600}>Crafting Steps</Text>
        <Text size="xs" c="dimmed">no-machine first</Text>
        {doneCount > 0 && (
          <Text size="xs" c="green" ml="auto">
            {doneCount}/{sorted.length} done
          </Text>
        )}
      </Group>

      <Stack gap="xs">
        {sorted.map((step, i) => (
          <CraftingStepCard
            key={step.item}
            step={step}
            index={i}
            rawMaterials={rawMaterials}
            recipeIndex={recipeIndex}
            done={done.has(step.item)}
            onToggle={() => toggle(step.item)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
