"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Accordion, Alert, Button, Card, Group, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { AlertCircle, Plus } from "lucide-react";
import { createRecipeAction, updateRecipeAction, deleteRecipeAction, VariantInput } from "@/app/actions/recipes";
import { ExistingRecipe } from "@/types";
import VariantSection from "./VariantSection";

interface RecipeInput { item: string; quantity: number; }
interface Variant { inputs: RecipeInput[]; machine: string; }

interface Props {
  recipeId?: string;
  initialName?: string;
  initialOutputQuantity?: number;
  initialVariants?: Variant[];
  existingRecipes?: ExistingRecipe[];
}

const emptyVariant = (): Variant => ({ inputs: [{ item: "", quantity: 1 }], machine: "" });

export default function RecipeForm({
  recipeId,
  initialName = "",
  initialOutputQuantity = 1,
  initialVariants,
  existingRecipes = [],
}: Props) {
  const recipeIndex = new Map(existingRecipes.map((r) => [r.name.toLowerCase(), r.id]));
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [outputQuantity, setOutputQuantity] = useState(initialOutputQuantity);
  const [variants, setVariants] = useState<Variant[]>(initialVariants ?? [emptyVariant()]);
  const [openVariants, setOpenVariants] = useState<string[]>(["0"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = !!recipeId;

  const addVariant = () => {
    const i = variants.length;
    setVariants((v) => [...v, emptyVariant()]);
    setOpenVariants((prev) => [...prev, String(i)]);
  };

  const removeVariant = (i: number) => {
    setVariants((v) => v.filter((_, idx) => idx !== i));
    setOpenVariants((prev) =>
      prev
        .filter((x) => x !== String(i))
        .map((x) => (Number(x) > i ? String(Number(x) - 1) : x))
    );
  };

  const updateVariantMachine = (i: number, machine: string) =>
    setVariants((v) => v.map((variant, idx) => (idx === i ? { ...variant, machine } : variant)));

  const addInput = (vi: number) =>
    setVariants((v) =>
      v.map((variant, i) =>
        i === vi ? { ...variant, inputs: [...variant.inputs, { item: "", quantity: 1 }] } : variant
      )
    );

  const removeInput = (vi: number, ii: number) =>
    setVariants((v) =>
      v.map((variant, i) =>
        i === vi ? { ...variant, inputs: variant.inputs.filter((_, j) => j !== ii) } : variant
      )
    );

  const updateItem = (vi: number, ii: number, value: string) =>
    setVariants((v) =>
      v.map((variant, i) =>
        i === vi
          ? { ...variant, inputs: variant.inputs.map((inp, j) => (j === ii ? { ...inp, item: value } : inp)) }
          : variant
      )
    );

  const updateQuantity = (vi: number, ii: number, value: number) =>
    setVariants((v) =>
      v.map((variant, i) =>
        i === vi
          ? { ...variant, inputs: variant.inputs.map((inp, j) => (j === ii ? { ...inp, quantity: value } : inp)) }
          : variant
      )
    );

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

    if (result.error) { setError(result.error); setLoading(false); return; }
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
    <form onSubmit={handleSubmit}>
      <Stack maw={672} gap="lg">
        <Card withBorder>
          <Stack gap="sm">
            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Output</Text>
            <Group align="flex-end" gap="sm">
              <TextInput
                flex={1}
                label="Item name"
                placeholder='e.g. "Electric Motor (LV)"'
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
              />
              <NumberInput
                w={120}
                label="Qty produced"
                value={outputQuantity}
                onChange={(v) => setOutputQuantity(Number(v) || 1)}
                min={1}
                required
              />
            </Group>
          </Stack>
        </Card>

        <Stack gap="xs">
          <Text size="xs" fw={600} tt="uppercase" c="dimmed">Crafting variants</Text>
          <Accordion
            multiple
            variant="separated"
            value={openVariants}
            onChange={setOpenVariants}
          >
            {variants.map((variant, vi) => (
              <VariantSection
                key={vi}
                index={vi}
                variant={variant}
                canRemove={variants.length > 1}
                recipeIndex={recipeIndex}
                onRemove={() => removeVariant(vi)}
                onMachineChange={(v) => updateVariantMachine(vi, v)}
                onItemChange={(ii, v) => updateItem(vi, ii, v)}
                onQuantityChange={(ii, v) => updateQuantity(vi, ii, v)}
                onAddInput={() => addInput(vi)}
                onRemoveInput={(ii) => removeInput(vi, ii)}
              />
            ))}
          </Accordion>

          <Button
            variant="default"
            size="sm"
            leftSection={<Plus size={14} />}
            w="fit-content"
            onClick={addVariant}
          >
            Add variant
          </Button>
        </Stack>

        {error && (
          <Alert icon={<AlertCircle size={14} />} color="red" variant="light">
            {error}
          </Alert>
        )}

        <Group>
          <Button type="submit" loading={loading}>
            {isEdit ? "Save changes" : "Create recipe"}
          </Button>
          <Button variant="subtle" color="gray" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          {isEdit && (
            <Button
              variant="outline"
              color="red"
              type="button"
              ml="auto"
              loading={loading}
              onClick={handleDelete}
            >
              Delete recipe
            </Button>
          )}
        </Group>
      </Stack>
    </form>
  );
}
