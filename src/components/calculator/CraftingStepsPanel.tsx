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
  return (
    <Stack gap="sm">
      <Group gap="xs">
        <ThemeIcon variant="transparent" color="orange" size="sm">
          <Wrench size={16} />
        </ThemeIcon>
        <Text fw={600}>Crafting Steps</Text>
        <Text size="xs" c="dimmed">bottom-up order</Text>
      </Group>

      <Stack gap="xs">
        {craftingSteps.map((step, i) => (
          <CraftingStepCard
            key={step.item}
            step={step}
            index={i}
            rawMaterials={rawMaterials}
            recipeIndex={recipeIndex}
          />
        ))}
      </Stack>
    </Stack>
  );
}
