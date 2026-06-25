import QuickLinkCard from "@/components/dashboard/QuickLinkCard";
import RecipesCountLabel from "@/components/dashboard/RecipesCountLabel";
import WelcomeHeading from "@/components/dashboard/WelcomeHeading";
import { SimpleGrid, Skeleton, Stack, Title } from "@mantine/core";
import { BookOpen, Calculator, Plus } from "lucide-react";
import { Suspense } from "react";

export default async function DashboardPage() {
  return (
    <Stack gap="xl">
      <div>
        <Suspense
          fallback={
            <Title order={1} className="page-title">
              Welcome back
            </Title>
          }
        >
          <WelcomeHeading />
        </Suspense>
        <p className="page-subtitle">Your modded crafting recipe hub.</p>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
        <QuickLinkCard href="/recipes/new" label="New Recipe" icon={Plus}>
          Add to your recipe book
        </QuickLinkCard>

        <QuickLinkCard href="/recipes" label="My Recipes" icon={BookOpen}>
          <Suspense
            fallback={
              <Skeleton
                component="span"
                height={13}
                width={60}
                display="inline-block"
              />
            }
          >
            <RecipesCountLabel />
          </Suspense>
        </QuickLinkCard>

        <QuickLinkCard href="/calculator" label="Calculator" icon={Calculator}>
          Calculate a crafting chain
        </QuickLinkCard>
      </SimpleGrid>
    </Stack>
  );
}
