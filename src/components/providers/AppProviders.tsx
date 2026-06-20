"use client";

import { MantineProvider } from "@mantine/core";
import { theme } from "@/lib/theme";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
}
