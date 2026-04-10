"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useUiPreferences } from "@/components/providers/ui-preferences-provider";
import { cn } from "@/lib/tailwind/utils";

type AuthenticatedShellProps = {
  children: ReactNode;
  header: ReactNode;
  sidebar?: ReactNode;
  contentClassName?: string;
};

export function AuthenticatedShell({
  children,
  header,
  sidebar,
  contentClassName,
}: AuthenticatedShellProps) {
  const { sidebarCollapsed } = useUiPreferences();
  const pathname = usePathname();
  const showSidebar =
    Boolean(sidebar) &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/manager") ||
      pathname.startsWith("/courses"));

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-md px-md py-sm lg:px-lg">
          {header}
        </div>
      </header>
      <div
        className={cn(
          "mx-auto grid w-full max-w-7xl gap-lg px-md py-md md:items-start lg:px-lg lg:py-lg",
          showSidebar && !sidebarCollapsed
            ? "md:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]"
            : "md:grid-cols-[minmax(0,1fr)]",
        )}
      >
        {showSidebar && !sidebarCollapsed ? (
          <aside className="min-w-0 md:sticky md:top-lg">{sidebar}</aside>
        ) : null}
        <main className="min-w-0">
          <div
            className={cn(
              "rounded-lg border border-border bg-surface p-lg shadow-card md:p-xl",
              contentClassName,
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
