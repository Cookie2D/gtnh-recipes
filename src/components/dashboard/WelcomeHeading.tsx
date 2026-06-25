import { requireUser } from "@/lib/data/auth";
import { Title } from "@mantine/core";

export default async function WelcomeHeading() {
  const user = await requireUser();
  const username = user.user_metadata?.username ?? user.email?.split("@")[0];
  return (
    <Title order={1} className="page-title">
      Welcome back, <span className="text-neon">{username}</span>
    </Title>
  );
}
