import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ColorSchemeScript } from "@mantine/core";
import AppProviders from "@/components/providers/AppProviders";
import "@mantine/core/styles.css";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ModCrafter",
  description: "Crafting chain calculator for modded Minecraft",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
