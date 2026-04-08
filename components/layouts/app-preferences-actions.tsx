"use client";

import {
  MoonStar,
  PanelLeftClose,
  PanelLeftOpen,
  SunMedium,
} from "lucide-react";

import { useUiPreferences } from "@/components/providers/ui-preferences-provider";
import { Button } from "@/components/ui/button";

export function AppPreferencesActions() {
  const { sidebarCollapsed, theme, toggleSidebarCollapsed, toggleTheme } =
    useUiPreferences();

  return (
    <div className="flex items-center gap-sm">
      <Button variant="subtle" size="sm" onClick={toggleSidebarCollapsed}>
        {sidebarCollapsed ? (
          <PanelLeftOpen className="size-4" />
        ) : (
          <PanelLeftClose className="size-4" />
        )}
        <span>{sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}</span>
      </Button>
      <Button variant="subtle" size="sm" onClick={toggleTheme}>
        {theme === "light" ? (
          <MoonStar className="size-4" />
        ) : (
          <SunMedium className="size-4" />
        )}
        <span>{theme === "light" ? "Dark theme" : "Light theme"}</span>
      </Button>
    </div>
  );
}
