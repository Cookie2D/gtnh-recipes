"use client";

import { Box, Skeleton, Stack } from "@mantine/core";

export function CalculationResultsSkeleton() {
  return (
    <Stack gap="md">
      {/* Raw Materials Table Skeleton */}
      <Box>
        <Skeleton height={40} mb="xs" />
        <Stack gap="xs">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`table-row-${i}`} height={36} />
          ))}
        </Stack>
      </Box>

      {/* Crafting Steps List Skeleton */}
      <Box>
        <Skeleton height={40} mb="xs" />
        <Stack gap="xs">
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={`step-${i}`}>
              <Skeleton height={32} mb="xs" />
              <Skeleton height={24} width="60%" />
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
