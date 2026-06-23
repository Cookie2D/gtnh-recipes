import Link from "next/link";
import { Box, Text, Title, Group, Stack } from "@mantine/core";
import GameBackground from "@/components/ui/GameBackground";
import { NEON, NEON_BORDER } from "@/lib/theme";


export default function LandingPage() {
  return (
    <Box
      component="main"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <GameBackground />

      <Stack gap="xl" style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
        <Stack gap="sm">
          <Title
            order={1}
            ff="var(--font-geist-mono)"
            fw={900}
            fz={{ base: 52, sm: 68 }}
            style={{
              color: "#f0fdf4",
              textShadow:
                "0 0 40px rgba(74,222,128,0.4), 0 0 80px rgba(74,222,128,0.15)",
              lineHeight: 1.1,
            }}
          >
            Mod<span style={{ color: NEON }}>Crafter</span>
          </Title>
          <Text
            size="lg"
            maw={480}
            mx="auto"
            style={{ color: "#6b7280", lineHeight: 1.7 }}
          >
            Calculate crafting chains for modded Minecraft. Enter a target item
            and get a full list of raw materials with step-by-step instructions.
          </Text>
        </Stack>

        <Group justify="center" gap="sm">
          <Link
            href="/register"
            style={{
              display: "inline-block",
              padding: "10px 28px",
              borderRadius: 8,
              fontFamily: "var(--font-geist-mono)",
              fontWeight: 700,
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              textDecoration: "none",
              background: NEON,
              color: "#0a0a0a",
              boxShadow: "0 0 24px rgba(74,222,128,0.4)",
            }}
          >
            Get started free
          </Link>
          <Link
            href="/login"
            style={{
              display: "inline-block",
              padding: "10px 28px",
              borderRadius: 8,
              fontFamily: "var(--font-geist-mono)",
              fontWeight: 700,
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              textDecoration: "none",
              background: "transparent",
              color: NEON,
              border: `1px solid ${NEON_BORDER}`,
            }}
          >
            Sign in
          </Link>
        </Group>
      </Stack>
    </Box>
  );
}
