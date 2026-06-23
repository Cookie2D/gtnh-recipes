# Graph Report - gtnh-crafting-system  (2026-06-23)

## Corpus Check
- 45 files · ~8,584 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 173 nodes · 245 edges · 18 communities (12 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b1e42813`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 24 edges
2. `compilerOptions` - 16 edges
3. `CraftingStep` - 6 edges
4. `Json` - 6 edges
5. `ExistingRecipe` - 6 edges
6. `scripts` - 5 edges
7. `registerAction()` - 4 edges
8. `loginAction()` - 4 edges
9. `VariantOptions` - 4 edges
10. `calculateAction()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `loadVariantPrefs()` --calls--> `createClient()`  [EXTRACTED]
  src/app/actions/calculator.ts → src/lib/supabase/server.ts
- `CalculatorPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(dashboard)/calculator/page.tsx → src/lib/supabase/server.ts
- `DashboardPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/page.tsx → src/lib/supabase/server.ts
- `RecipeRow` --references--> `Json`  [EXTRACTED]
  src/app/(dashboard)/recipes/[id]/edit/page.tsx → src/types/database.ts
- `EditRecipePage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(dashboard)/recipes/[id]/edit/page.tsx → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (18 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (23): RecipeRow, createRecipeAction(), deleteRecipeAction(), updateRecipeAction(), VariantInput, CalculatorPage(), GET(), DashboardPage() (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (12): saveVariantPref(), CalculatorClient(), Props, Props, Props, Props, CalculationResult, CraftingStep (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (18): dependencies, lucide-react, @mantine/core, @mantine/hooks, next, react, react-dom, @supabase/ssr (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (12): calculateAction(), CalculateResult, loadVariantPrefs(), VariantOption, VariantOptions, Props, Props, calculate() (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (7): geistMono, geistSans, metadata, dark, orange, theme, AppProviders()

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, postcss-preset-mantine, postcss-simple-vars, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.39
Nodes (3): loginAction(), registerAction(), createAdminClient()

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (4): Props, Props, RecipeInput, Variant

### Community 10 - "Community 10"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **73 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 0` to `Community 2`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `ExistingRecipe` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 6` to `Community 3`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11229946524064172 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14035087719298245 - nodes in this community are weakly interconnected._