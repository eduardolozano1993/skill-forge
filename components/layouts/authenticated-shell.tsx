import type { ReactNode } from "react";

type AuthenticatedShellProps = {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
};

export function AuthenticatedShell({
  children,
  header,
  sidebar,
}: AuthenticatedShellProps) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-lg">
          {header}
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-7xl gap-lg px-lg py-lg">
        <aside className="hidden w-64 shrink-0 lg:block">{sidebar}</aside>
        <main className="min-w-0 flex-1">
          <div className="rounded-lg border border-border bg-surface p-xl shadow-card">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
