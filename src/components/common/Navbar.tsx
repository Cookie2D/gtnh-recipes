"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Calculator, BookOpen, LayoutDashboard, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recipes", label: "Recipes", icon: BookOpen },
  { href: "/calculator", label: "Calculator", icon: Calculator },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav
      className="flex items-center gap-1 px-4 py-3 border-b"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <Link href="/dashboard" className="mr-6 font-bold text-lg shrink-0">
        <span style={{ color: "var(--accent)" }}>GTNH</span> Crafter
      </Link>

      <div className="flex items-center gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? "var(--accent-dim)" : "transparent",
                color: active ? "var(--accent)" : "var(--muted)",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ml-auto"
        style={{ color: "var(--muted)" }}
      >
        <LogOut size={16} />
        Sign out
      </button>
    </nav>
  );
}
