import Link from "next/link";
import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/auth";
import { AppPreferencesActions } from "@/components/layouts/app-preferences-actions";
import { AuthenticatedShell } from "@/components/layouts/authenticated-shell";
import { ProfileMenu } from "@/components/layouts/profile-menu";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireAdmin();

  return (
    <AuthenticatedShell
      header={
        <div className="flex w-full items-center justify-between gap-md">
          <div className="min-w-0">
            <Link
              href="/admin"
              className="block truncate font-heading text-lg font-semibold text-text-strong"
            >
              Skill Forge
            </Link>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-sm">
            <AppPreferencesActions />
            <ProfileMenu user={session.user} />
          </div>
        </div>
      }
      contentClassName="p-lg md:p-xl"
    >
      {children}
    </AuthenticatedShell>
  );
}
