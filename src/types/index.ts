export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

export interface UserMachine {
  id: string;
  userId: string;
  name: string;
  tier?: string;
}

export interface RecipeInput {
  item: string;
  quantity: number;
}

export interface RecipeVariant {
  id: string;
  recipeId: string;
  variantIndex: number;
  inputs: RecipeInput[];
  machines: string[];
  efficiencyScore?: number;
}

export interface Recipe {
  id: string;
  userId: string;
  name: string;
  outputItem: string;
  outputQuantity: number;
  iconUrl?: string;
  version: string;
  variants: RecipeVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CraftingStep {
  stepNumber: number;
  description: string;
  inputs: RecipeInput[];
  output: { item: string; quantity: number };
  machine?: string;
  subSteps?: CraftingStep[];
}

export interface DependencyNode {
  item: string;
  quantity: number;
  parents: string[];
  isRaw: boolean;
  recipeId?: string;
}

export interface CraftingCalculation {
  itemName: string;
  quantity: number;
  rawMaterials: Record<string, number>;
  craftingSteps: CraftingStep[];
  dependencies: DependencyNode[];
}

export interface CalculationHistory {
  id: string;
  userId: string;
  itemName: string;
  quantity: number;
  rawMaterials: Record<string, number>;
  craftingSteps: CraftingStep[];
  createdAt: Date;
  accessedAt: Date;
}
