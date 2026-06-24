import { Stack, Title, SimpleGrid } from "@mantine/core";
import Link from "next/link";
import { BookOpen, Calculator, Plus } from "lucide-react";
import { requireUser } from "@/lib/data/auth";
import { getRecipesCount } from "@/lib/data/recipes";
import { NEON } from "@/lib/theme";

const quickLinks = [
  { href: "/recipes/new", label: "New Recipe",  sub: "Add to your recipe book",   icon: Plus },
  { href: "/recipes",     label: "My Recipes",  sub: null,                         icon: BookOpen },
  { href: "/calculator",  label: "Calculator",  sub: "Calculate a crafting chain", icon: Calculator },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const recipesCount = await getRecipesCount(user.id);
  const username = user.user_metadata?.username ?? user.email?.split("@")[0];

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} className="page-title">
          Welcome back, <span className="text-neon">{username}</span>
        </Title>
        <p className="page-subtitle">Your modded crafting recipe hub.</p>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
        {quickLinks.map(({ href, label, sub, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="neon-card"
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px" }}
          >
            <div className="neon-icon-box">
              <Icon size={20} color={NEON} />
            </div>
            <div>
              <p className="recipe-card-name" style={{ marginBottom: 2 }}>{label}</p>
              <p className="text-dim" style={{ fontSize: "var(--mantine-font-size-xs)" }}>
                {href === "/recipes" ? `${recipesCount} recipes` : sub}
              </p>
            </div>
          </Link>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
