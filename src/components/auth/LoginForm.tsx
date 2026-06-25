"use client";

import { loginFormAction } from "@/app/actions/auth";
import {
  Anchor,
  Button,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import Link from "next/link";
import { useActionState } from "react";

const inputClassNames = {
  input: "auth-input",
  label: "auth-input-label",
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginFormAction, {});

  return (
    <Paper p="xl" radius="md" className="auth-card">
      <form action={formAction}>
        <Stack gap="md">
          <TextInput
            name="identifier"
            label="Email or username"
            required
            placeholder="you@example.com"
            autoComplete="username"
            classNames={inputClassNames}
          />

          <PasswordInput
            name="password"
            label="Password"
            required
            placeholder="••••••••"
            autoComplete="current-password"
            classNames={{
              ...inputClassNames,
              innerInput: "auth-password-inner",
            }}
          />

          {state.error && (
            <Text
              fz="xs"
              ff="var(--font-geist-mono)"
              p="xs"
              className="auth-error"
            >
              {state.error}
            </Text>
          )}

          <Button
            type="submit"
            loading={isPending}
            fullWidth
            className="auth-submit-btn"
          >
            Sign in →
          </Button>

          <Divider className="auth-divider" />

          <Text ta="center" fz="xs" className="auth-footer-text">
            No account?{" "}
            <Anchor
              component={Link}
              href="/register"
              className="auth-footer-link"
            >
              Register free
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
