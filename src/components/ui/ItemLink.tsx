import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Anchor } from "@mantine/core";
import { ExistingRecipe } from "@/types";

interface Props {
  item: string;
  recipeIndex: Map<string, string>;
  className?: string;
}

export function buildRecipeIndex(recipes: ExistingRecipe[]): Map<string, string> {
  return new Map(recipes.map((r) => [r.name.toLowerCase(), r.id]));
}

export default function ItemLink({ item, recipeIndex, className }: Props) {
  const trimmed = item.trim();
  if (!trimmed) return <span className={className}>{item}</span>;

  const existingId = recipeIndex.get(trimmed.toLowerCase());
  const href = existingId
    ? `/recipes/${existingId}/edit`
    : `/recipes/new?name=${encodeURIComponent(trimmed)}`;

  return (
    <Anchor
      component={Link}
      href={href}
      c={existingId ? "green" : "orange"}
      className={className}
      title={existingId ? `Edit recipe for "${trimmed}"` : `Create recipe for "${trimmed}"`}
      style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
    >
      {trimmed}
      {existingId ? <Pencil size={11} /> : <Plus size={11} />}
    </Anchor>
  );
}
