"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Button, Group, Text } from "@mantine/core";
import { Calculator, BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NEON, NEON_BORDER, NEON_DIM } from "@/lib/theme";

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
    <Box
      component="nav"
      px="md"
      py="sm"
      style={{
        borderBottom: `1px solid ${NEON_BORDER}`,
        background: "#141414",
      }}
    >
      <Group gap="xs">
        <Text
          component={Link}
          href="/dashboard"
          ff="var(--font-geist-mono)"
          fw={900}
          fz="lg"
          mr="md"
          style={{
            textDecoration: "none",
            color: "#f0fdf4",
            textShadow: "0 0 20px rgba(74,222,128,0.3)",
          }}
        >
          Mod<span style={{ color: NEON }}>Crafter</span>
        </Text>

        <Group gap={4} flex={1}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Button
                key={href}
                component={Link}
                href={href}
                variant="subtle"
                size="sm"
                leftSection={<Icon size={15} />}
                ff="var(--font-geist-mono)"
                style={
                  active
                    ? {
                        color: NEON,
                        background: NEON_DIM,
                        border: `1px solid ${NEON_BORDER}`,
                        fontWeight: 700,
                      }
                    : {
                        color: "#6b7280",
                        background: "transparent",
                        border: "1px solid transparent",
                      }
                }
              >
                {label}
              </Button>
            );
          })}
        </Group>

        <Button
          variant="outline"
          size="sm"
          leftSection={<LogOut size={15} />}
          onClick={handleLogout}
          ff="var(--font-geist-mono)"
          fw={700}
          tt="uppercase"
          style={{
            color: "#9ca3af",
            borderColor: "rgba(156,163,175,0.3)",
            letterSpacing: "0.06em",
          }}
        >
          Sign out
        </Button>
      </Group>
    </Box>
  );
}
