"use client";

import { registerAction } from "@/app/actions/auth";
import GameBackground from "@/components/ui/GameBackground";
import Logo from "@/components/ui/Logo";
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

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await registerAction(email, username, password);

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
          <Logo />
          <Text
            fz={11}
            ff="var(--font-geist-mono)"
            tt="uppercase"
            style={{ color: "#4b5563", letterSpacing: "0.12em" }}
          >
            Create your account
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
          <form onSubmit={handleRegister}>
            <Stack gap="md">
              <TextInput
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                styles={inputStyles}
              />

              <TextInput
                label="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="CreeperSlayer"
                minLength={3}
                autoComplete="username"
                styles={inputStyles}
              />

              <PasswordInput
                label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                autoComplete="new-password"
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
                Create account →
              </Button>

              <Divider style={{ borderColor: "rgba(255,255,255,0.06)" }} />

              <Text ta="center" fz="xs" style={{ color: "#4b5563" }}>
                Already have an account?{" "}
                <Anchor
                  component={Link}
                  href="/login"
                  ff="var(--font-geist-mono)"
                  fw={700}
                  style={{ color: NEON }}
                >
                  Sign in
                </Anchor>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Box>
  );
}
