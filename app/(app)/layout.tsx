import Link from "next/link";

import { AuthenticatedShell } from "@/components/layouts/authenticated-shell";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" },
  { href: "/sign-in", label: "Auth" },
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
          <div className="text-sm text-text-soft">Authenticated shell</div>
        </>
      }
      sidebar={
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
      }
    >
      {children}
    </AuthenticatedShell>
  );
}
