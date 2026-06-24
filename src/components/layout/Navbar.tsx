"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Button, Group } from "@mantine/core";
import { Calculator, BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NEON } from "@/lib/theme";

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
      className="navbar-root"
    >
      <Group gap="xs">
        <Link href="/dashboard" className="navbar-logo">
          Mod<span style={{ color: NEON }}>Crafter</span>
        </Link>

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
                className="nav-btn"
                data-active={active}
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
          className="navbar-signout"
        >
          Sign out
        </Button>
      </Group>
    </Box>
  );
}
