"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { useUiPreferences } from "@/components/providers/ui-preferences-provider";
import { Button } from "@/components/ui/button";

export function AppPreferencesActions() {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUiPreferences();

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
    </div>
  );
}
