"use client";

import { NEON } from "@/lib/theme";
import { Title } from "@mantine/core";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Title
        order={1}
        ff="var(--font-geist-mono)"
        fw={900}
        fz={28}
        style={{
          color: "#f0fdf4",
          textShadow: "0 0 30px rgba(74,222,128,0.35)",
          textDecoration: "none",
        }}
      >
        Mod<span style={{ color: NEON }}>Crafter</span>
      </Title>
    </Link>
  );
}
