# Graph Report - gtnh-crafting-system  (2026-06-26)

## Corpus Check
- 59 files · ~10,328 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 223 nodes · 373 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `93855b04`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 37 edges
2. `compilerOptions` - 16 edges
3. `CalculateResult` - 6 edges
4. `CraftingStep` - 6 edges
5. `getRecipesWithVariants()` - 6 edges
6. `Json` - 6 edges
7. `scripts` - 5 edges
8. `EditRecipeFormData()` - 5 edges
9. `registerAction()` - 5 edges
10. `loginAction()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `DashboardPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/page.tsx → src/lib/supabase/server.ts
- `CalculatorPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(dashboard)/calculator/page.tsx → src/lib/supabase/server.ts
- `EditRecipePage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(dashboard)/recipes/[id]/edit/page.tsx → src/lib/supabase/server.ts
- `NewRecipePage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(dashboard)/recipes/new/page.tsx → src/lib/supabase/server.ts
- `RecipesPage()` --calls--> `createClient()`  [EXTRACTED]
  src/app/(dashboard)/recipes/page.tsx → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (18 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (24): RecipeRow, CalculatorPage(), GET(), getUserId(), getVariantPrefs(), VariantPref, extractIngredientNames(), getRecipeById() (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (19): dependencies, lucide-react, @mantine/core, @mantine/hooks, next, react, react-dom, @supabase/ssr (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (26): calculateAction(), CalculateResult, getRecentRecipesWithVariants(), loadVariantPrefs(), RecentRecipesResult, RecipeSummary, saveVariantPref(), searchRecipes() (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (10): geistMono, geistSans, metadata, navItems, dark, neon, orange, theme (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, postcss-preset-mantine, postcss-simple-vars, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (8): loginAction(), loginFormAction(), registerAction(), registerFormAction(), inputClassNames, inputStyles, createAdminClient(), Logo()

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (4): Props, Props, RecipeInput, Variant

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (11): createRecipeAction(), deleteRecipeAction(), getRecipePageAction(), RecipePage, updateRecipeAction(), VariantInput, RecipeListItem, emptyVariant() (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 13 - "Community 13"
Cohesion: 0.32
Nodes (7): DashboardPage(), QuickLinkCard(), RecipesCountLabel(), WelcomeHeading(), requireUser(), requireUserId(), getRecipesCount()

## Knowledge Gaps
- **77 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 0` to `Community 9`, `Community 4`, `Community 13`, `Community 7`?**
  _High betweenness centrality (0.204) - this node is a cross-community bridge._
- **Why does `registerAction()` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `loginAction()` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11587301587301588 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._