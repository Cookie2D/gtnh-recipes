export interface RecipeMap {
  [itemName: string]: {
    outputQuantity: number;
    inputs: { item: string; quantity: number }[];
    machine: string;
  };
}

export interface CraftingStep {
  item: string;
  quantity: number;
  inputs: { item: string; quantity: number }[];
  machine: string;
}

export interface CalculationResult {
  rawMaterials: Record<string, number>;
  craftingSteps: CraftingStep[];
}

export function calculate(
  targetItem: string,
  targetQuantity: number,
  recipes: RecipeMap
): CalculationResult {
  // Phase 1: accumulate total needed quantities for every item in the DAG.
  // We do a BFS so shared sub-ingredients are summed before we recurse into them.
  const needed = new Map<string, number>();

  const queue: { item: string; qty: number }[] = [{ item: targetItem, qty: targetQuantity }];
  const inQueue = new Set<string>();

  // Cycle detection
  const resolving = new Set<string>();

  while (queue.length > 0) {
    const { item, qty } = queue.shift()!;

    needed.set(item, (needed.get(item) ?? 0) + qty);

    const recipe = recipes[item];
    if (!recipe) continue; // raw material

    if (resolving.has(item)) {
      throw new Error(`Cyclic dependency detected at "${item}".`);
    }

    if (inQueue.has(item)) continue; // already scheduled for expansion
    inQueue.add(item);

    resolving.add(item);
    const batches = Math.ceil(qty / recipe.outputQuantity);
    for (const input of recipe.inputs) {
      queue.push({ item: input.item, qty: input.quantity * batches });
    }
    resolving.delete(item);
  }

  // Phase 2: Now that we know total quantities, build the step list via topological order.
  // Items with no recipe are raw materials; everything else is a crafting step.
  // We need to emit steps bottom-up (raw first, target last).

  const rawMaterials: Record<string, number> = {};
  const stepsMap = new Map<string, CraftingStep>();

  // Topological sort (Kahn's algorithm) over items that have recipes.
  // Build adjacency: item → items that depend on it (i.e. item is an input for them).
  const dependents = new Map<string, Set<string>>(); // item → set of items that USE item
  const inDegree = new Map<string, number>(); // item → number of its ingredients that have recipes

  for (const [item] of needed) {
    const recipe = recipes[item];
    if (!recipe) {
      rawMaterials[item] = needed.get(item)!;
      continue;
    }
    inDegree.set(item, 0);
    for (const input of recipe.inputs) {
      if (!dependents.has(input.item)) dependents.set(input.item, new Set());
      dependents.get(input.item)!.add(item);
    }
  }

  // Count in-degrees (only edges between items that have recipes matter)
  for (const [item] of inDegree) {
    const recipe = recipes[item]!;
    for (const input of recipe.inputs) {
      if (inDegree.has(input.item)) {
        inDegree.set(item, inDegree.get(item)! + 1);
      }
    }
  }

  const topoQueue: string[] = [];
  for (const [item, deg] of inDegree) {
    if (deg === 0) topoQueue.push(item);
  }

  let stepNumber = 1;
  while (topoQueue.length > 0) {
    const item = topoQueue.shift()!;
    const recipe = recipes[item]!;
    const totalNeeded = needed.get(item)!;
    const batches = Math.ceil(totalNeeded / recipe.outputQuantity);

    stepsMap.set(item, {
      item,
      quantity: totalNeeded,
      inputs: recipe.inputs.map((inp) => ({ item: inp.item, quantity: inp.quantity * batches })),
      machine: recipe.machine,
    });

    stepNumber++;

    for (const dep of dependents.get(item) ?? []) {
      inDegree.set(dep, inDegree.get(dep)! - 1);
      if (inDegree.get(dep) === 0) topoQueue.push(dep);
    }
  }

  return {
    rawMaterials,
    craftingSteps: Array.from(stepsMap.values()),
  };
}
