"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Button, Combobox, Group, InputBase, NumberInput, Stack, Text, useCombobox } from "@mantine/core";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

interface Props {
  recipeNames: string[];
  loading: boolean;
  error: string;
  onCalculate: (item: string, quantity: number) => void;
}

const RECENT_LIMIT = 6;
const FILTER_LIMIT = 8;

export default function ItemSearch({ recipeNames, loading, error, onCalculate }: Props) {
  const router = useRouter();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState(1);

  const trimmed = query.trim();
  const isSearching = !!trimmed;

  const filtered = isSearching
    ? recipeNames.filter((n) => n.toLowerCase().includes(trimmed.toLowerCase())).slice(0, FILTER_LIMIT)
    : recipeNames.slice(0, RECENT_LIMIT);

  const exactMatch = recipeNames.find((n) => n.toLowerCase() === trimmed.toLowerCase());
  const selectedItem = exactMatch ?? "";
  const showCreate = isSearching && !exactMatch;
  const hasOptions = filtered.length > 0 || showCreate;

  const handleOptionSubmit = (val: string) => {
    if (val === "__create__") {
      router.push(`/recipes/new?name=${encodeURIComponent(trimmed)}`);
    } else {
      setQuery(val);
    }
    combobox.closeDropdown();
  };

  return (
    <Stack>
      <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
        <Combobox.Target>
          <InputBase
            label="Target item"
            placeholder="Search your recipes..."
            leftSection={<Search size={15} />}
            value={query}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
            }}
            onFocus={() => { if (recipeNames.length > 0) combobox.openDropdown(); }}
            onBlur={() => combobox.closeDropdown()}
          />
        </Combobox.Target>

        {hasOptions && (
          <Combobox.Dropdown>
            <Combobox.Options>
              {!isSearching ? (
                <Combobox.Group label="Recent recipes">
                  {filtered.map((name) => (
                    <Combobox.Option key={name} value={name}>
                      {name}
                    </Combobox.Option>
                  ))}
                </Combobox.Group>
              ) : (
                <>
                  {filtered.map((name) => (
                    <Combobox.Option key={name} value={name}>
                      {name}
                    </Combobox.Option>
                  ))}

                  {showCreate && (
                    <Combobox.Option value="__create__">
                      <Group gap="xs">
                        <Plus size={13} color="var(--mantine-color-orange-5)" />
                        <Text size="sm" c="orange">
                          Create recipe for &ldquo;{trimmed}&rdquo;
                        </Text>
                      </Group>
                    </Combobox.Option>
                  )}
                </>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        )}
      </Combobox>

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
