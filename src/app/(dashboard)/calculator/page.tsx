export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Калькулятор крафтів</h1>
      <div
        className="rounded-xl border p-12 text-center"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <p className="text-lg font-medium mb-2">Скоро буде готово</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Спершу заповни рецепти — потім зможеш розраховувати крафти тут.
        </p>
      </div>
    </div>
  );
}
