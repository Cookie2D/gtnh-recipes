import Navbar from "@/components/layout/Navbar";
import GameBackground from "@/components/ui/GameBackground";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      <GameBackground />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
        <Navbar />
        <div style={{ flex: 1, padding: "1.5rem 1rem", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
