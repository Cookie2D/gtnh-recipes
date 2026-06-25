import { requireUserId } from "@/lib/data/auth";
import { getRecipesCount } from "@/lib/data/recipes";

export default async function RecipesCountLabel() {
  const userId = await requireUserId();
  const count = await getRecipesCount(userId);
  return <>{count} recipes</>;
}
