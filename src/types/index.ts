export interface ExistingRecipe {
  id: string;
  name: string;
}

export interface RecipeIngredient {
  item: string;
  quantity: number;
}

export interface CraftingStep {
  item: string;
  quantity: number;
  inputs: RecipeIngredient[];
  machine: string;
}

export interface CalculationResult {
  rawMaterials: Record<string, number>;
  craftingSteps: CraftingStep[];
}
