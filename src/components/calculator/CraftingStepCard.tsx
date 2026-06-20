import { Badge, Box, Card, Group, Stack, Text } from "@mantine/core";
import { Wrench } from "lucide-react";
import ItemLink from "@/components/ui/ItemLink";
import { CraftingStep } from "@/lib/calculator/engine";

interface Props {
  step: CraftingStep;
  index: number;
  rawMaterials: Record<string, number>;
  recipeIndex: Map<string, string>;
}

export default function CraftingStepCard({ step, index, rawMaterials, recipeIndex }: Props) {
  const rawInputs = step.inputs.filter((inp) => rawMaterials[inp.item] !== undefined);
  const craftedInputs = step.inputs.filter((inp) => rawMaterials[inp.item] === undefined);

  return (
    <Card withBorder>
      <Stack gap="xs">
        <Group gap="xs">
          <Badge variant="light" color="orange" size="sm" ff="monospace">#{index + 1}</Badge>
          <Text size="sm" fw={500}>
            {step.quantity}× <ItemLink item={step.item} recipeIndex={recipeIndex} />
          </Text>
          {step.machine && (
            <Group gap={4} ml="auto">
              <Wrench size={12} color="var(--mantine-color-dimmed)" />
              <Text size="xs" c="dimmed">{step.machine}</Text>
            </Group>
          )}
        </Group>

        {rawInputs.length > 0 && (
          <Box
            p="xs"
            style={{
              background: "rgba(249, 115, 22, 0.1)",
              borderRadius: "var(--mantine-radius-sm)",
            }}
          >
            <Text size="xs" fw={600} c="orange" mb={4}>Raw materials needed</Text>
            <Group gap="md" wrap="wrap">
              {rawInputs.map((inp) => (
                <Group key={inp.item} gap={4}>
                  <Text size="xs" ff="monospace" fw={600} c="orange">{inp.quantity}×</Text>
                  <ItemLink item={inp.item} recipeIndex={recipeIndex} />
                </Group>
              ))}
            </Group>
          </Box>
        )}

        {craftedInputs.length > 0 && (
          <Group gap="md" wrap="wrap">
            {craftedInputs.map((inp) => (
              <Group key={inp.item} gap={4}>
                <Text size="xs" ff="monospace" c="dimmed">{inp.quantity}×</Text>
                <ItemLink item={inp.item} recipeIndex={recipeIndex} />
              </Group>
            ))}
          </Group>
        )}
      </Stack>
    </Card>
  );
}
