"use client";

import {
  getRecentRecipesWithVariants,
  RecipeSummary,
  searchRecipes,
} from "@/app/actions/calculator";
import {
  Button,
  Combobox,
  Group,
  InputBase,
  Loader,
  NumberInput,
  Stack,
  useCombobox,
} from "@mantine/core";
import { Play, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  onSelectRecipe: (itemName: string, quantity: number) => void;
  loading: boolean;
}

const DEBOUNCE_MS = 300;

export default function SearchPanel({ onSelectRecipe, loading }: Props) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Prefetch state
  const [prefetchedResults, setPrefetchedResults] = useState<RecipeSummary[]>(
    [],
  );
  const [isPrefetchComplete, setIsPrefetchComplete] = useState(false);

  // Search state
  const [searchResults, setSearchResults] = useState<RecipeSummary[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // Debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Prefetch on mount
  useEffect(() => {
    const prefetch = async () => {
      const result = await getRecentRecipesWithVariants(10);
      setPrefetchedResults(result.items);
      setIsPrefetchComplete(true);
    };
    prefetch();
  }, []);

  // Debounced search
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsLoadingSearch(false);
      return;
    }

    setIsLoadingSearch(true);
    const result = await searchRecipes(searchQuery, 0, 10);
    setSearchResults(result.items);
    setHasSearched(true);
    setIsLoadingSearch(false);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, DEBOUNCE_MS);
  };

  const handleOptionSubmit = (val: string) => {
    setQuery(val);
    combobox.closeDropdown();
  };

  const handleCalculate = () => {
    if (query.trim()) {
      onSelectRecipe(query, quantity);
      setQuery("");
      setHasSearched(false);
      setSearchResults([]);
    }
  };

  const displayResults =
    !isLoadingSearch && hasSearched ? searchResults : prefetchedResults;
  const userIsSearching = query.trim().length > 0;
  const showOptions =
    combobox.dropdownOpened && displayResults.length > 0 && isPrefetchComplete;

  return (
    <Stack>
      <Combobox store={combobox} onOptionSubmit={handleOptionSubmit}>
        <Combobox.Target>
          <InputBase
            label="Target item"
            placeholder="Search your recipes..."
            leftSection={<Search size={15} />}
            rightSection={
              userIsSearching && isLoadingSearch && <Loader size="xs" />
            }
            value={query}
            onChange={(e) => {
              handleQueryChange(e.currentTarget.value);
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
            }}
            onFocus={() => {
              if (isPrefetchComplete) combobox.openDropdown();
            }}
            onBlur={() => combobox.closeDropdown()}
          />
        </Combobox.Target>

        {showOptions && (
          <Combobox.Dropdown>
            <Combobox.Options>
              {!userIsSearching && (
                <Combobox.Group label="Recent recipes">
                  {displayResults.map((recipe) => (
                    <Combobox.Option key={recipe.id} value={recipe.name}>
                      {recipe.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Group>
              )}

              {userIsSearching &&
                displayResults.map((recipe) => (
                  <Combobox.Option key={recipe.id} value={recipe.name}>
                    {recipe.name}
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </Combobox.Dropdown>
        )}
      </Combobox>

      <Group gap="xs" align="end">
        <NumberInput
          label="Quantity"
          min={1}
          value={quantity}
          onChange={(val) => setQuantity(typeof val === "number" ? val : 1)}
          flex={1}
        />
      </Group>

      <Button
        leftSection={<Play size={16} />}
        onClick={handleCalculate}
        disabled={query.trim().length === 0}
        loading={loading}
        fullWidth
      >
        Calculate
      </Button>
    </Stack>
  );
}
