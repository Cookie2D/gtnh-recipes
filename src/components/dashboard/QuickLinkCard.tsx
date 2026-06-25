import { NEON } from "@/lib/theme";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

export default function QuickLinkCard({
  href,
  label,
  icon: Icon,
  children,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="neon-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px",
      }}
    >
      <div className="neon-icon-box">
        <Icon size={20} color={NEON} />
      </div>
      <div>
        <p className="recipe-card-name" style={{ marginBottom: 2 }}>
          {label}
        </p>
        <p
          className="text-dim"
          style={{ fontSize: "var(--mantine-font-size-xs)" }}
        >
          {children}
        </p>
      </div>
    </Link>
  );
}
