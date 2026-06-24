"use client";

import { ActionIcon, Accordion, Badge, Box, Button, Group, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { Plus, Trash2 } from "lucide-react";
import IngredientRow from "./IngredientRow";

interface RecipeInput { item: string; quantity: number; }
interface Variant { inputs: RecipeInput[]; machine: string; outputQuantity: number; }

interface Props {
  index: number;
  variant: Variant;
  canRemove: boolean;
  suggestions: string[];
  recipeIndex: Map<string, string>;
  onRemove: () => void;
  onMachineChange: (value: string) => void;
  onOutputQuantityChange: (value: number) => void;
  onItemChange: (inputIdx: number, value: string) => void;
  onQuantityChange: (inputIdx: number, value: number) => void;
  onAddInput: () => void;
  onRemoveInput: (inputIdx: number) => void;
}

export default function VariantSection({
  index, variant, canRemove, suggestions, recipeIndex,
  onRemove, onMachineChange, onOutputQuantityChange, onItemChange, onQuantityChange, onAddInput, onRemoveInput,
}: Props) {
  return (
    <Accordion.Item value={String(index)}>
      <Box style={{ display: "flex", alignItems: "center" }}>
        <Accordion.Control style={{ flex: 1 }}>
          <Group gap="xs">
            <Text size="sm" fw={500}>Variant {index + 1}</Text>
            {variant.machine && (
              <Badge variant="light" color="orange" size="xs">{variant.machine}</Badge>
            )}
          </Group>
        </Accordion.Control>
        {canRemove && (
          <ActionIcon
            variant="subtle"
            color="red"
            size="sm"
            mx="xs"
            aria-label="Remove variant"
            onClick={onRemove}
          >
            <Trash2 size={13} />
          </ActionIcon>
        )}
      </Box>

      <Accordion.Panel>
        <Stack gap="sm">
          <Group align="flex-end" gap="sm">
            <TextInput
              flex={1}
              label="Machine (optional)"
              placeholder='e.g. "Bending Machine"'
              value={variant.machine}
              onChange={(e) => onMachineChange(e.currentTarget.value)}
              size="sm"
            />
            <NumberInput
              w={120}
              label="Qty produced"
              value={variant.outputQuantity}
              onChange={(v) => onOutputQuantityChange(Number(v) || 1)}
              min={1}
              size="sm"
              required
            />
          </Group>

          <Stack gap={4}>
            <Text size="sm" fw={500}>Ingredients</Text>
            <Stack gap="xs">
              {variant.inputs.map((inp, ii) => (
                <IngredientRow
                  key={ii}
                  item={inp.item}
                  quantity={inp.quantity}
                  canRemove={variant.inputs.length > 1}
                  suggestions={suggestions}
                  recipeIndex={recipeIndex}
                  onItemChange={(v) => onItemChange(ii, v)}
                  onQuantityChange={(v) => onQuantityChange(ii, v)}
                  onRemove={() => onRemoveInput(ii)}
                />
              ))}
            </Stack>
            <Button
              variant="subtle"
              color="orange"
              size="xs"
              leftSection={<Plus size={13} />}
              mt={4}
              w="fit-content"
              onClick={onAddInput}
            >
              Add ingredient
            </Button>
          </Stack>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
