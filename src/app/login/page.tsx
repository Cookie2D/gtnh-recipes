"use client";

import { loginAction } from "@/app/actions/auth";
import GameBackground from "@/components/ui/GameBackground";
import { NEON, NEON_BORDER } from "@/lib/theme";
import {
  Anchor,
  Box,
  Button,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputStyles = {
  input: {
    background: "#1a1a1a",
    border: `1px solid rgba(255,255,255,0.08)`,
    color: "#f0fdf4",
    fontFamily: "var(--font-geist-mono)",
    fontSize: 13,
    "&:focus": {
      borderColor: NEON_BORDER,
    },
  },
  label: {
    color: "#6b7280",
    fontFamily: "var(--font-geist-mono)",
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    marginBottom: 6,
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginAction(identifier, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <Box
      component="main"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <GameBackground />

      <Stack
        gap="md"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 380,
        }}
      >
        <Stack gap={4} align="center">
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
          <Text
            fz={11}
            ff="var(--font-geist-mono)"
            tt="uppercase"
            style={{ color: "#4b5563", letterSpacing: "0.12em" }}
          >
            Sign in to your account
          </Text>
        </Stack>

        <Paper
          p="xl"
          radius="md"
          style={{
            background: "#141414",
            border: `1px solid ${NEON_BORDER}`,
            boxShadow: "0 0 40px rgba(74,222,128,0.06)",
          }}
        >
          <form onSubmit={handleLogin}>
            <Stack gap="md">
              <TextInput
                label="Email or username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
                styles={inputStyles}
              />

              <PasswordInput
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                styles={{
                  ...inputStyles,
                  innerInput: {
                    color: "#f0fdf4",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 13,
                  },
                }}
              />

              {error && (
                <Text
                  fz="xs"
                  ff="var(--font-geist-mono)"
                  p="xs"
                  style={{
                    color: "#f87171",
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.2)",
                    borderRadius: 8,
                  }}
                >
                  {error}
                </Text>
              )}

              <Button
                type="submit"
                loading={loading}
                fullWidth
                ff="var(--font-geist-mono)"
                fw={700}
                tt="uppercase"
                style={{
                  background: NEON,
                  color: "#0a0a0a",
                  boxShadow: "0 0 20px rgba(74,222,128,0.3)",
                  letterSpacing: "0.08em",
                  border: "none",
                }}
              >
                Sign in →
              </Button>

              <Divider style={{ borderColor: "rgba(255,255,255,0.06)" }} />

              <Text ta="center" fz="xs" style={{ color: "#4b5563" }}>
                No account?{" "}
                <Anchor
                  component={Link}
                  href="/register"
                  ff="var(--font-geist-mono)"
                  fw={700}
                  style={{ color: NEON }}
                >
                  Register free
                </Anchor>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Box>
  );
}
