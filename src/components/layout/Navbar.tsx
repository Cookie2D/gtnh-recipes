"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Anchor, Box, Button, Group, Text } from "@mantine/core";
import { Calculator, BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
        borderBottom: "1px solid var(--mantine-color-dark-4)",
        background: "var(--mantine-color-dark-7)",
      }}
    >
      <Group gap="xs">
        <Anchor
          component={Link}
          href="/dashboard"
          fw={700}
          fz="lg"
          c="inherit"
          mr="md"
          style={{ textDecoration: "none" }}
        >
          Mod<Text component="span" c="orange" inherit>Crafter</Text>
        </Anchor>

        <Group gap={4} flex={1}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Button
                key={href}
                component={Link}
                href={href}
                variant={active ? "light" : "subtle"}
                color={active ? "orange" : "gray"}
                size="sm"
                leftSection={<Icon size={16} />}
              >
                {label}
              </Button>
            );
          })}
        </Group>

        <Button
          variant="subtle"
          color="gray"
          size="sm"
          leftSection={<LogOut size={16} />}
          onClick={handleLogout}
        >
          Sign out
        </Button>
      </Group>
    </Box>
  );
}
