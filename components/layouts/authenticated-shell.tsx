import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthenticatedShellProps = {
  children: ReactNode;
  header: ReactNode;
  sidebar: ReactNode;
  contentClassName?: string;
};

export function AuthenticatedShell({
  children,
  header,
  sidebar,
  contentClassName,
}: AuthenticatedShellProps) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-md px-md py-sm lg:px-lg">
          {header}
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-7xl gap-lg px-md py-md md:grid-cols-[16rem_minmax(0,1fr)] md:items-start lg:px-lg lg:py-lg xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="min-w-0 md:sticky md:top-lg">{sidebar}</aside>
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
