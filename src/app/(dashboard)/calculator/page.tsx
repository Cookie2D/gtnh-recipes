import CalculatorClient from "@/components/calculator/CalculatorClient";
import { requireUserId } from "@/lib/data/auth";
import { Badge, Stack, Title } from "@mantine/core";

export default async function CalculatorPage() {
  await requireUserId();

  return (
    <Stack gap="xl">
      <div>
        <Badge variant="outline" className="page-badge">
          Chain Resolver
        </Badge>
        <Title order={1} className="page-title">
          Crafting <span className="text-neon">Calculator</span>
        </Title>
        <p className="page-subtitle">
          Enter a target item and quantity to resolve the full crafting chain.
        </p>
      </div>
      <CalculatorClient />
    </Stack>
  );
}
