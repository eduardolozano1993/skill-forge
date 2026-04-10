import Link from "next/link";
import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/auth";
import { AppPreferencesActions } from "@/components/layouts/app-preferences-actions";
import { AuthenticatedShell } from "@/components/layouts/authenticated-shell";
import { EmployeeSidebarNav } from "@/components/layouts/employee-sidebar-nav";
import { ProfileMenu } from "@/components/layouts/profile-menu";
import {
  Card,
  CardContent,
  CardEyebrow,
  CardHeader,
} from "@/components/ui/card";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
];

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
      sidebar={
        <div className="space-y-md">
          <Card>
            <CardHeader className="pb-sm">
              <CardEyebrow>Navigation</CardEyebrow>
            </CardHeader>
            <CardContent className="pt-0">
              <EmployeeSidebarNav
                items={navItems}
                ariaLabel="Admin dashboard navigation"
              />
            </CardContent>
          </Card>
        </div>
      }
      contentClassName="p-lg md:p-xl"
    >
      {children}
    </AuthenticatedShell>
  );
}
