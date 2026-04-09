"use client";

import { ChevronRight, MoonStar, SunMedium } from "lucide-react";

import type { UiTheme } from "@/components/providers/ui-preferences-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ThemePreferencesSectionProps = {
  theme: UiTheme;
  onToggleTheme: () => void;
};

export function ThemePreferencesSection({
  theme,
  onToggleTheme,
}: ThemePreferencesSectionProps) {
  return (
    <section className="space-y-lg">
      <div className="space-y-xs">
        <h2 className="font-heading text-3xl font-semibold text-brand md:text-4xl">
          Application settings
        </h2>
        <p className="max-w-2xl text-sm text-text-soft">
          Manage visual preferences for this browser session and local workspace experience.
        </p>
      </div>

      <div className="grid gap-lg xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card variant="muted" className="overflow-hidden">
          <CardHeader>
            <CardEyebrow>Theme</CardEyebrow>
            <CardTitle>{theme === "light" ? "Light theme" : "Dark theme"}</CardTitle>
            <CardDescription>
              Switch the interface palette. The current selection is saved in local storage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-md">
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-md py-md text-left transition hover:border-brand hover:bg-surface-muted"
            >
              <span className="flex items-center gap-sm">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft text-brand">
                  {theme === "light" ? (
                    <MoonStar className="size-5" />
                  ) : (
                    <SunMedium className="size-5" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-medium text-text-strong">
                    {theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
                  </span>
                  <span className="block text-sm text-text-soft">
                    {theme === "light"
                      ? "Reduce glare for evening sessions."
                      : "Use a brighter palette for daytime work."}
                  </span>
                </span>
              </span>
              <ChevronRight className="size-4 text-text-soft" />
            </button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardEyebrow>Preference notes</CardEyebrow>
            <CardTitle>Local behavior</CardTitle>
            <CardDescription>
              These preferences apply locally in this browser and do not affect other users.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-sm md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface-muted px-md py-md">
              <p className="text-sm font-medium text-text-strong">Storage</p>
              <p className="mt-2xs text-sm text-text-soft">
                Theme and sidebar preferences are persisted with browser local storage.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-muted px-md py-md">
              <p className="text-sm font-medium text-text-strong">Scope</p>
              <p className="mt-2xs text-sm text-text-soft">
                Changes update the current application shell immediately after selection.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
