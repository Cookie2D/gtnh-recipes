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
  // Phase 1: DFS to discover all items reachable from targetItem
  const discovered = new Set<string>();
  const stack: string[] = [targetItem];
  while (stack.length > 0) {
    const item = stack.pop()!;
    if (discovered.has(item)) continue;
    discovered.add(item);
    const recipe = recipes[item];
    if (recipe) {
      for (const inp of recipe.inputs) stack.push(inp.item);
    }
  }

  // Phase 2: Topological sort of crafted items only (Kahn's algorithm).
  // Produces bottom-up order: raw-material producers first, target item last.
  const dependents = new Map<string, Set<string>>(); // item → crafted items that USE it
  const inDegree = new Map<string, number>();         // crafted item → # of crafted inputs

  for (const item of discovered) {
    if (recipes[item]) inDegree.set(item, 0);
  }

  for (const item of inDegree.keys()) {
    for (const inp of recipes[item]!.inputs) {
      if (!dependents.has(inp.item)) dependents.set(inp.item, new Set());
      dependents.get(inp.item)!.add(item);
      if (inDegree.has(inp.item)) {
        inDegree.set(item, inDegree.get(item)! + 1);
      }
    }
  }

  const topoQueue: string[] = [];
  for (const [item, deg] of inDegree) {
    if (deg === 0) topoQueue.push(item);
  }

  const bottomUp: string[] = [];
  while (topoQueue.length > 0) {
    const item = topoQueue.shift()!;
    bottomUp.push(item);
    for (const dep of dependents.get(item) ?? []) {
      const newDeg = inDegree.get(dep)! - 1;
      inDegree.set(dep, newDeg);
      if (newDeg === 0) topoQueue.push(dep);
    }
  }

  if (bottomUp.length < inDegree.size) {
    throw new Error("Cyclic dependency detected in recipe graph.");
  }

  // Phase 3: Propagate quantities TOP-DOWN (target first, raw materials last).
  //
  // Processing items in reverse topological order guarantees that when we reach
  // item X, ALL crafted items that consume X have already run and contributed their
  // share to needed[X]. This correctly handles shared sub-items (DAG diamonds) that
  // the old single-pass BFS could not: the BFS expanded ingredients on first encounter
  // using only the partial qty seen so far, under-counting shared items.
  const needed = new Map<string, number>([[targetItem, targetQuantity]]);

  for (let i = bottomUp.length - 1; i >= 0; i--) {
    const item = bottomUp[i];
    const qty = needed.get(item) ?? 0;
    if (qty === 0) continue;
    const recipe = recipes[item]!;
    const batches = Math.ceil(qty / recipe.outputQuantity);
    for (const inp of recipe.inputs) {
      needed.set(inp.item, (needed.get(inp.item) ?? 0) + inp.quantity * batches);
    }
  }

  // Phase 4: Build output using the correct accumulated quantities.
  const rawMaterials: Record<string, number> = {};
  for (const item of discovered) {
    if (!recipes[item]) {
      const qty = needed.get(item) ?? 0;
      if (qty > 0) rawMaterials[item] = qty;
    }
  }

  const craftingSteps: CraftingStep[] = bottomUp.map((item) => {
    const recipe = recipes[item]!;
    const totalNeeded = needed.get(item) ?? 0;
    const batches = Math.ceil(totalNeeded / recipe.outputQuantity);
    return {
      item,
      quantity: totalNeeded,
      inputs: recipe.inputs.map((inp) => ({
        item: inp.item,
        quantity: inp.quantity * batches,
      })),
      machine: recipe.machine,
    };
  });

  return { rawMaterials, craftingSteps };
}
