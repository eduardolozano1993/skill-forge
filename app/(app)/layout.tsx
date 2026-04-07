import Link from "next/link";

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
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-lg py-md">
          <Link href="/" className="font-heading text-lg font-semibold text-text-strong">
            Skill Forge
          </Link>
          <nav className="flex items-center gap-md text-sm text-text-soft">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-brand">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
