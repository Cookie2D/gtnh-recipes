import RecipeForm from "@/components/recipes/RecipeForm";

export default function NewRecipePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Recipe</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Define what an item is made of and which machine produces it.
        </p>
      </div>
      <RecipeForm />
    </div>
  );
}
