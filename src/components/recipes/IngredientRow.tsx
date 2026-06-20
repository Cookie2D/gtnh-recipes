"use client";

import { ActionIcon, Anchor, Autocomplete, Box, Group, NumberInput } from "@mantine/core";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface Props {
  item: string;
  quantity: number;
  canRemove: boolean;
  suggestions: string[];
  recipeIndex: Map<string, string>;
  onItemChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onRemove: () => void;
}

export default function IngredientRow({ item, quantity, canRemove, suggestions, recipeIndex, onItemChange, onQuantityChange, onRemove }: Props) {
  const trimmed = item.trim();
  const existingId = trimmed ? recipeIndex.get(trimmed.toLowerCase()) : undefined;
  const linkHref = existingId
    ? `/recipes/${existingId}/edit`
    : trimmed
    ? `/recipes/new?name=${encodeURIComponent(trimmed)}`
    : undefined;

  const recipeIcon = linkHref ? (
    <Anchor
      component={Link}
      href={linkHref}
      c={existingId ? "green" : "orange"}
      title={existingId ? `Edit recipe for "${trimmed}"` : `Create recipe for "${trimmed}"`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        flexShrink: 0,
        borderRadius: "var(--mantine-radius-sm)",
      }}
    >
      {existingId ? <Pencil size={13} /> : <Plus size={13} />}
    </Anchor>
  ) : (
    <Box
      c="dimmed"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        flexShrink: 0,
        opacity: 0.4,
      }}
    >
      <Plus size={13} />
    </Box>
  );

  return (
    <Group gap="xs" wrap="nowrap">
      <Autocomplete
        flex={1}
        value={item}
        onChange={onItemChange}
        data={suggestions}
        placeholder="Item name"
        size="sm"
        limit={6}
      />

      {recipeIcon}

      <NumberInput
        w={72}
        value={quantity}
        onChange={(v) => onQuantityChange(Number(v) || 1)}
        min={1}
        size="sm"
        hideControls
      />

      <ActionIcon
        variant="subtle"
        color="red"
        size="sm"
        disabled={!canRemove}
        onClick={onRemove}
        aria-label="Remove ingredient"
      >
        <Trash2 size={13} />
      </ActionIcon>
    </Group>
  );
}
