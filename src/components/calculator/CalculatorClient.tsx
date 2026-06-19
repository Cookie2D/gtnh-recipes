"use client";

import { useState, useRef } from "react";
import { Search, Package, Wrench, ExternalLink, Pencil } from "lucide-react";
import { calculateAction } from "@/app/actions/calculator";
import { CraftingStep } from "@/lib/calculator/engine";

interface ExistingRecipe {
  id: string;
  name: string;
}

interface Props {
  recipeNames: string[];
  existingRecipes: ExistingRecipe[];
}

export default function CalculatorClient({ recipeNames, existingRecipes }: Props) {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawMaterials, setRawMaterials] = useState<Record<string, number> | null>(null);
  const [craftingSteps, setCraftingSteps] = useState<CraftingStep[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const recipeIndex = new Map(existingRecipes.map((r) => [r.name.toLowerCase(), r.id]));

  const suggestions = query.trim()
    ? recipeNames.filter((n) => n.toLowerCase().includes(query.toLowerCase()))
    : [];

  const selectItem = (name: string) => {
    setSelectedItem(name);
    setQuery(name);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleCalculate = async () => {
    if (!selectedItem) return;
    setError("");
    setLoading(true);
    setRawMaterials(null);
    setCraftingSteps(null);

    const result = await calculateAction(selectedItem, quantity);

    if (result.error) {
      setError(result.error);
    } else {
      setRawMaterials(result.rawMaterials);
      setCraftingSteps(result.craftingSteps);
    }
    setLoading(false);
  };

  const sortedRaw = rawMaterials
    ? Object.entries(rawMaterials).sort((a, b) => b[1] - a[1])
    : [];

  const hasResults = rawMaterials !== null && craftingSteps !== null;

  const ingredientLink = (itemName: string) => {
    const existingId = recipeIndex.get(itemName.toLowerCase());
    return existingId
      ? { href: `/recipes/${existingId}/edit`, isEdit: true }
      : { href: `/recipes/new?name=${encodeURIComponent(itemName)}`, isEdit: false };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* === INPUT PANEL === */}
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Target item</label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedItem(""); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search your recipes..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul
              className="absolute z-10 w-full mt-1 rounded-lg border overflow-hidden shadow-lg"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              {suggestions.slice(0, 8).map((name) => (
                <li
                  key={name}
                  onMouseDown={() => selectItem(name)}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-white/5"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <button
          onClick={handleCalculate}
          disabled={!selectedItem || loading}
          className="w-full py-2 rounded-lg font-semibold text-sm disabled:opacity-50 transition-opacity"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>

        {error && <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}

        {recipeNames.length === 0 && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No recipes yet. Add some in the{" "}
            <a href="/recipes" style={{ color: "var(--accent)" }}>Recipes</a> section first.
          </p>
        )}
      </div>

      {/* === RAW MATERIALS === */}
      <div>
        {hasResults && (
          <>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Package size={16} style={{ color: "var(--accent)" }} />
              Raw Materials
              <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>for {quantity}× {selectedItem}</span>
            </h2>
            <div className="rounded-xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              {sortedRaw.length === 0 ? (
                <p className="px-4 py-3 text-sm" style={{ color: "var(--muted)" }}>No raw materials — all sub-items have recipes.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
                      <th className="px-4 py-2 font-medium" style={{ color: "var(--muted)" }}>Item</th>
                      <th className="px-4 py-2 font-medium text-right" style={{ color: "var(--muted)" }}>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRaw.map(([item, qty]) => (
                      <tr key={item} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                        <td className="px-4 py-2">
                          <a
                            href={`/recipes/new?name=${encodeURIComponent(item)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Create recipe for "${item}"`}
                            className="inline-flex items-center gap-1.5 hover:underline"
                            style={{ color: "var(--foreground)" }}
                          >
                            {item}
                            <ExternalLink size={11} style={{ color: "var(--accent)", flexShrink: 0 }} />
                          </a>
                        </td>
                        <td className="px-4 py-2 text-right font-mono" style={{ color: "var(--accent)" }}>{qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      {/* === CRAFTING STEPS === */}
      <div>
        {hasResults && craftingSteps!.length > 0 && (
          <>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Wrench size={16} style={{ color: "var(--accent)" }} />
              Crafting Steps
              <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>bottom-up order</span>
            </h2>
            <div className="space-y-2">
              {craftingSteps!.map((step, i) => {
                const rawInputs = step.inputs.filter((inp) => rawMaterials![inp.item] !== undefined);
                const craftedInputs = step.inputs.filter((inp) => rawMaterials![inp.item] === undefined);

                return (
                  <div
                    key={step.item}
                    className="rounded-xl border p-4 space-y-3"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-mono px-1.5 py-0.5 rounded"
                        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                      >
                        #{i + 1}
                      </span>
                      <span className="font-medium text-sm">{step.quantity}× {step.item}</span>
                      {step.machine && (
                        <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>{step.machine}</span>
                      )}
                    </div>

                    {/* Raw material inputs — highlighted */}
                    {rawInputs.length > 0 && (
                      <div className="rounded-lg px-3 py-2 space-y-1" style={{ background: "var(--accent-dim)" }}>
                        <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>Raw materials needed</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {rawInputs.map((inp) => (
                            <span key={inp.item} className="text-xs flex items-center gap-1">
                              <span className="font-mono font-semibold" style={{ color: "var(--accent)" }}>{inp.quantity}×</span>
                              <a
                                href={`/recipes/new?name=${encodeURIComponent(inp.item)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Create recipe for "${inp.item}"`}
                                className="hover:underline"
                                style={{ color: "var(--foreground)" }}
                              >
                                {inp.item}
                              </a>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Crafted inputs */}
                    {craftedInputs.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {craftedInputs.map((inp) => {
                          const { href, isEdit } = ingredientLink(inp.item);
                          return (
                            <span key={inp.item} className="text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                              <span className="font-mono" style={{ color: "var(--foreground)" }}>{inp.quantity}×</span>
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 hover:underline"
                                style={{ color: "var(--muted)" }}
                              >
                                {inp.item}
                                {isEdit
                                  ? <Pencil size={10} style={{ color: "var(--success)" }} />
                                  : <ExternalLink size={10} style={{ color: "var(--accent)" }} />}
                              </a>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
