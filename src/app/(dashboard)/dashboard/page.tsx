import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Stack, Title, Text, SimpleGrid, Box } from "@mantine/core";
import { Calculator, BookOpen, Plus } from "lucide-react";
import { NEON, NEON_BORDER, NEON_DIM } from "@/lib/theme";

const quickLinks = [
  { href: "/calculator", label: "Calculator", sub: "Calculate a crafting chain", icon: Calculator },
  { href: "/recipes/new", label: "New Recipe", sub: "Add to your recipe book", icon: Plus },
  { href: "/recipes", label: "My Recipes", icon: BookOpen },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count: recipesCount } = await supabase
    .from("recipes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: historyItems } = await supabase
    .from("calculation_history")
    .select("id, item_name, quantity, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5) as { data: { id: string; item_name: string; quantity: number; created_at: string }[] | null };

  const username = user.user_metadata?.username ?? user.email?.split("@")[0];

  return (
    <Stack gap="xl">
      <div>
        <Title order={1} ff="var(--font-geist-mono)" fw={900} fz={28} style={{ color: "#f0fdf4" }}>
          Welcome back, <span style={{ color: NEON }}>{username}</span>
        </Title>
        <Text fz="sm" mt={4} style={{ color: "#6b7280" }}>
          Your modded crafting recipe hub.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
        {quickLinks.map(({ href, label, sub, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="neon-card"
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px" }}
          >
            <Box
              style={{
                padding: 10,
                borderRadius: 8,
                background: NEON_DIM,
                border: `1px solid ${NEON_BORDER}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={20} color={NEON} />
            </Box>
            <div>
              <Text fw={600} fz="sm" style={{ color: "#f0fdf4" }}>{label}</Text>
              <Text fz="xs" style={{ color: "#6b7280" }}>
                {href === "/recipes" ? `${recipesCount ?? 0} recipes` : sub}
              </Text>
            </div>
          </Link>
        ))}
      </SimpleGrid>

    </Stack>
  );
}
