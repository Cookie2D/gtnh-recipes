export interface ExistingRecipe {
  id: string;
  name: string;
}

export interface RecipeItem {
  name: string;
  id?: string;
}

export interface EnrichedCraftingStep {
  item: RecipeItem;
  quantity: number;
  inputs: { item: RecipeItem; quantity: number }[];
  machine: string;
}
