export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Crafting Calculator</h1>
      <div
        className="rounded-xl border p-12 text-center"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <p className="text-lg font-medium mb-2">Coming soon</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Add your recipes first, then calculate crafting chains here.
        </p>
      </div>
    </div>
  );
}
