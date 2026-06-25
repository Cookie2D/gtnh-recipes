import LoginForm from "@/components/auth/LoginForm";
import GameBackground from "@/components/ui/GameBackground";
import Logo from "@/components/ui/Logo";
import { Center, Stack } from "@mantine/core";

export default function LoginPage() {
  return (
    <Center mih="100vh" style={{ position: "relative" }}>
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
          <p className="auth-eyebrow">Sign in to your account</p>
        </Stack>

        <LoginForm />
      </Stack>
    </Center>
  );
}
