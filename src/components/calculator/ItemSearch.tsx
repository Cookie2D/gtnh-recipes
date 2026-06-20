"use client";

import { useState } from "react";
import { Anchor, Autocomplete, Button, NumberInput, Stack, Text } from "@mantine/core";
import { Search } from "lucide-react";
import Link from "next/link";

interface Props {
  recipeNames: string[];
  loading: boolean;
  error: string;
  onCalculate: (item: string, quantity: number) => void;
}

export default function ItemSearch({ recipeNames, loading, error, onCalculate }: Props) {
  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState(1);

  const selectedItem = recipeNames.find((n) => n.toLowerCase() === query.toLowerCase()) ?? "";

  return (
    <Stack>
      <Autocomplete
        label="Target item"
        placeholder="Search your recipes..."
        leftSection={<Search size={15} />}
        data={recipeNames}
        value={query}
        onChange={setQuery}
        onOptionSubmit={setQuery}
        limit={8}
      />

      <NumberInput
        label="Quantity"
        value={quantity}
        onChange={(v) => setQuantity(Math.max(1, Number(v)))}
        min={1}
      />

      <Button
        fullWidth
        disabled={!selectedItem}
        loading={loading}
        onClick={() => onCalculate(selectedItem, quantity)}
      >
        Calculate
      </Button>

      {error && <Text size="sm" c="red">{error}</Text>}

      {recipeNames.length === 0 && (
        <Text size="sm" c="dimmed">
          No recipes yet. Add some in the{" "}
          <Anchor component={Link} href="/recipes" c="orange">Recipes</Anchor> section.
        </Text>
      )}
    </Stack>
  );
}
