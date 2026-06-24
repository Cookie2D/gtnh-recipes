import Link from "next/link";
import { Box, Group, Stack, Title } from "@mantine/core";
import GameBackground from "@/components/ui/GameBackground";

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

      <Stack
        gap="xl"
        style={{ position: "relative", zIndex: 1, maxWidth: 640 }}
      >
        <Stack gap="sm">
          <Title order={1} className="landing-title">
            Mod<span className="text-neon">Crafter</span>
          </Title>
          <p className="landing-subtitle">
            Calculate crafting chains for modded Minecraft. Enter a target item
            and get a full list of raw materials with step-by-step instructions.
          </p>
        </Stack>

        <Group justify="center" gap="sm">
          <Link href="/register" className="landing-btn-primary">
            Get started free
          </Link>
          <Link href="/login" className="landing-btn-secondary">
            Sign in
          </Link>
        </Group>
      </Stack>
    </Box>
  );
}
