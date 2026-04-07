import Link from "next/link";

import { AuthenticatedShell } from "@/components/layouts/authenticated-shell";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sign-in", label: "Calendar" },
  { href: "/admin", label: "Resources" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthenticatedShell
      header={
        <>
          <Link href="/" className="font-heading text-lg font-semibold text-text-strong">
            Skill Forge
          </Link>
          <div className="text-sm text-text-soft">Learner dashboard</div>
        </>
      }
      sidebar={
        <div className="space-y-md">
          <div className="rounded-lg border border-border bg-surface p-md shadow-soft">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand">
              Workspace
            </p>
            <p className="mt-xs font-medium text-text-strong">Q2 Growth Plan</p>
            <p className="mt-2xs text-sm text-text-soft">
              Focused on architecture, delivery, and mentorship.
            </p>
          </div>
          <nav className="rounded-lg border border-border bg-surface p-md shadow-soft">
            <ul className="space-y-xs text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-sm py-xs text-text-soft transition-colors hover:bg-surface-muted hover:text-text-strong"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      }
    >
      {children}
    </AuthenticatedShell>
  );
}
