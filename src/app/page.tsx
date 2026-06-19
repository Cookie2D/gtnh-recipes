import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Mod<span style={{ color: "var(--accent)" }}>Crafter</span>
        </h1>
        <p className="text-xl" style={{ color: "var(--muted)" }}>
          Calculate crafting chains for modded Minecraft.
          Enter a target item and get a full list of raw materials with step-by-step instructions.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg font-semibold border transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
