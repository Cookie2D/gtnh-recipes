"use client";

import { Badge, Box, Card, Checkbox, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { Wrench } from "lucide-react";
import ItemLink from "@/components/ui/ItemLink";
import { EnrichedCraftingStep } from "@/types";
import { VariantOption } from "@/app/actions/calculator";

interface Props {
  step: EnrichedCraftingStep;
  index: number;
  rawMaterials: Record<string, number>;
  done: boolean;
  onToggle: () => void;
  variants?: VariantOption[];
  selectedVariant?: number;
  onVariantChange?: (variantIndex: number) => void;
}

export default function CraftingStepCard({
  step, index, rawMaterials, done, onToggle,
  variants, selectedVariant, onVariantChange,
}: Props) {
  const rawInputs = step.inputs.filter((inp) => rawMaterials[inp.item.name] !== undefined);
  const craftedInputs = step.inputs.filter((inp) => rawMaterials[inp.item.name] === undefined);
  const showVariantPicker = variants && variants.length > 1 && onVariantChange;

  return (
    <Card withBorder style={{ opacity: done ? 0.5 : 1, transition: "opacity 0.15s" }}>
      <Stack gap="xs">
        <Group gap="xs">
          <Checkbox
            checked={done}
            onChange={() => onToggle()}
            color="green"
            size="sm"
            aria-label={done ? "Mark as undone" : "Mark as done"}
          />
          <Badge
            variant="light"
            color={done ? "green" : "orange"}
            size="sm"
            ff="monospace"
          >
            #{index + 1}
          </Badge>
          <Text
            size="sm"
            fw={500}
            td={done ? "line-through" : undefined}
            c={done ? "dimmed" : undefined}
          >
            {step.quantity}× <ItemLink item={step.item} />
          </Text>
          {step.machine && (
            <Group gap={4} ml="auto">
              <Wrench size={12} color="var(--mantine-color-dimmed)" />
              <Text size="xs" c="dimmed">{step.machine}</Text>
            </Group>
          )}
        </Group>

        {showVariantPicker && (
          <SegmentedControl
            size="xs"
            value={String(selectedVariant ?? variants[0].variantIndex)}
            onChange={(val) => onVariantChange(Number(val))}
            data={variants.map((v) => ({ value: String(v.variantIndex), label: v.label }))}
            color="orange"
          />
        )}

        {!done && rawInputs.length > 0 && (
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
                <Group key={inp.item.name} gap={4}>
                  <Text size="xs" ff="monospace" fw={600} c="orange">{inp.quantity}×</Text>
                  <ItemLink item={inp.item} />
                </Group>
              ))}
            </Group>
          </Box>
        )}

        {!done && craftedInputs.length > 0 && (
          <Group gap="md" wrap="wrap">
            {craftedInputs.map((inp) => (
              <Group key={inp.item.name} gap={4}>
                <Text size="xs" ff="monospace" c="dimmed">{inp.quantity}×</Text>
                <ItemLink item={inp.item} />
              </Group>
            ))}
          </Group>
        )}
      </Stack>
    </Card>
  );
}
