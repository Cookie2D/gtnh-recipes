"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { createRecipeAction, updateRecipeAction, deleteRecipeAction, VariantInput } from "@/app/actions/recipes";

interface RecipeInput {
  item: string;
  quantity: number;
}

interface Variant {
  inputs: RecipeInput[];
  machine: string;
}

interface Props {
  recipeId?: string;
  initialName?: string;
  initialOutputQuantity?: number;
  initialVariants?: Variant[];
}

const emptyVariant = (): Variant => ({ inputs: [{ item: "", quantity: 1 }], machine: "" });

export default function RecipeForm({ recipeId, initialName = "", initialOutputQuantity = 1, initialVariants }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [outputQuantity, setOutputQuantity] = useState(initialOutputQuantity);
  const [variants, setVariants] = useState<Variant[]>(initialVariants ?? [emptyVariant()]);
  const [openVariants, setOpenVariants] = useState<Set<number>>(new Set([0]));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = !!recipeId;

  // --- variant helpers ---
  const toggleVariant = (i: number) =>
    setOpenVariants((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const addVariant = () => {
    const i = variants.length;
    setVariants((v) => [...v, emptyVariant()]);
    setOpenVariants((prev) => new Set([...prev, i]));
  };

  const removeVariant = (i: number) => {
    setVariants((v) => v.filter((_, idx) => idx !== i));
    setOpenVariants((prev) => {
      const next = new Set([...prev].filter((x) => x !== i).map((x) => (x > i ? x - 1 : x)));
      return next;
    });
  };

  const updateVariantMachine = (i: number, machine: string) =>
    setVariants((v) => v.map((variant, idx) => (idx === i ? { ...variant, machine } : variant)));

  // --- input helpers ---
  const addInput = (variantIdx: number) =>
    setVariants((v) =>
      v.map((variant, i) =>
        i === variantIdx ? { ...variant, inputs: [...variant.inputs, { item: "", quantity: 1 }] } : variant
      )
    );

  const removeInput = (variantIdx: number, inputIdx: number) =>
    setVariants((v) =>
      v.map((variant, i) =>
        i === variantIdx ? { ...variant, inputs: variant.inputs.filter((_, j) => j !== inputIdx) } : variant
      )
    );

  const updateInput = (variantIdx: number, inputIdx: number, field: "item" | "quantity", value: string | number) =>
    setVariants((v) =>
      v.map((variant, i) =>
        i === variantIdx
          ? {
              ...variant,
              inputs: variant.inputs.map((inp, j) =>
                j === inputIdx ? { ...inp, [field]: field === "quantity" ? Number(value) : value } : inp
              ),
            }
          : variant
      )
    );

  // --- submit ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanVariants: VariantInput[] = variants.map((v) => ({
      inputs: v.inputs.filter((inp) => inp.item.trim() !== ""),
      machine: v.machine.trim(),
    }));

    const result = isEdit
      ? await updateRecipeAction(recipeId!, name, outputQuantity, cleanVariants)
      : await createRecipeAction(name, outputQuantity, cleanVariants);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/recipes");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!recipeId || !confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    const result = await deleteRecipeAction(recipeId);
    if (result.error) { setError(result.error); setLoading(false); return; }
    router.push("/recipes");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Basic info */}
      <div
        className="rounded-xl border p-5 space-y-4"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Output
        </h2>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Item name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. "Electric Motor (LV)"'
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>
          <div className="w-28">
            <label className="block text-sm font-medium mb-1">Qty produced</label>
            <input
              type="number"
              required
              min={1}
              value={outputQuantity}
              onChange={(e) => setOutputQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            />
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Crafting variants
        </h2>

        {variants.map((variant, vi) => (
          <div
            key={vi}
            className="rounded-xl border"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            {/* Variant header */}
            <button
              type="button"
              onClick={() => toggleVariant(vi)}
              className="w-full flex items-center justify-between px-5 py-3 text-left"
            >
              <span className="font-medium text-sm">
                Variant {vi + 1}
                {variant.machine && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
                    {variant.machine}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                {variants.length > 1 && (
                  <span
                    onClick={(e) => { e.stopPropagation(); removeVariant(vi); }}
                    className="p-1 rounded hover:bg-red-500/10 cursor-pointer"
                    style={{ color: "var(--error)" }}
                  >
                    <Trash2 size={14} />
                  </span>
                )}
                {openVariants.has(vi) ? <ChevronUp size={16} style={{ color: "var(--muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--muted)" }} />}
              </div>
            </button>

            {openVariants.has(vi) && (
              <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: "var(--border)" }}>
                {/* Machine */}
                <div className="pt-4">
                  <label className="block text-sm font-medium mb-1">Machine (optional)</label>
                  <input
                    type="text"
                    value={variant.machine}
                    onChange={(e) => updateVariantMachine(vi, e.target.value)}
                    placeholder='e.g. "Bending Machine"'
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  />
                </div>

                {/* Inputs */}
                <div>
                  <label className="block text-sm font-medium mb-2">Ingredients</label>
                  <div className="space-y-2">
                    {variant.inputs.map((inp, ii) => (
                      <div key={ii} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={inp.item}
                          onChange={(e) => updateInput(vi, ii, "item", e.target.value)}
                          placeholder="Item name"
                          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                        />
                        <input
                          type="number"
                          min={1}
                          value={inp.quantity}
                          onChange={(e) => updateInput(vi, ii, "quantity", e.target.value)}
                          className="w-20 px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                        />
                        <button
                          type="button"
                          onClick={() => removeInput(vi, ii)}
                          disabled={variant.inputs.length === 1}
                          className="p-2 rounded-lg disabled:opacity-30"
                          style={{ color: "var(--error)" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addInput(vi)}
                    className="mt-2 flex items-center gap-1 text-sm"
                    style={{ color: "var(--accent)" }}
                  >
                    <Plus size={14} /> Add ingredient
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <Plus size={14} /> Add variant
        </button>
      </div>

      {error && <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-lg font-semibold text-sm disabled:opacity-60"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {loading ? "Saving..." : isEdit ? "Save changes" : "Create recipe"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 rounded-lg text-sm"
          style={{ color: "var(--muted)" }}
        >
          Cancel
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto px-4 py-2 rounded-lg text-sm disabled:opacity-60"
            style={{ color: "var(--error)", border: "1px solid var(--error)" }}
          >
            Delete recipe
          </button>
        )}
      </div>
    </form>
  );
}
