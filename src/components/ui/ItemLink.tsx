import { RecipeItem } from "@/types";
import { Anchor } from "@mantine/core";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  item: RecipeItem;
  className?: string;
}

export default function ItemLink({ item, className }: Props) {
  const name = item.name.trim();
  if (!name) return <span className={className}>{item.name}</span>;

  const href = item.id
    ? `/recipes/${item.id}/edit`
    : `/recipes/new?name=${encodeURIComponent(name)}`;

  return (
    <Anchor
      component={Link}
      href={href}
      c={item.id ? "green" : "orange"}
      className={className}
      title={item.id ? `Edit recipe for "${name}"` : `Create recipe for "${name}"`}
      style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
    >
      {name}
      {item.id ? <Pencil size={11} /> : <Plus size={11} />}
    </Anchor>
  );
}
