import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await requireAdmin();

  return <div className="min-h-screen bg-surface-muted">{children}</div>;
}
