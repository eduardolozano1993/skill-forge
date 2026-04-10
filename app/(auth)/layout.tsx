import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--brand-soft))_0%,_transparent_32%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--surface-muted))_100%)]">
      {children}
    </div>
  );
}
