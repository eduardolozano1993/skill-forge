import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { MockCourseOverridesProvider } from "@/components/providers/mock-course-overrides-provider";
import { UiPreferencesProvider } from "@/components/providers/ui-preferences-provider";

import "./globals.css";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skill Forge",
  description: "Application shell foundation for Skill Forge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} bg-background font-sans text-foreground`}>
        <UiPreferencesProvider>
          <MockCourseOverridesProvider>{children}</MockCourseOverridesProvider>
        </UiPreferencesProvider>
      </body>
    </html>
  );
}
