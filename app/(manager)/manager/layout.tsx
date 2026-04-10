import Link from "next/link";
import type { ReactNode } from "react";

import { requireManager } from "@/lib/auth/auth";
import { AppPreferencesActions } from "@/components/layouts/app-preferences-actions";
import { AuthenticatedShell } from "@/components/layouts/authenticated-shell";
import { EmployeeSidebarNav } from "@/components/layouts/employee-sidebar-nav";
import { ProfileMenu } from "@/components/layouts/profile-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardEyebrow,
  CardHeader,
} from "@/components/ui/card";

const navItems = [
  { href: "/manager", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
];

type ManagerLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function ManagerLayout({
  children,
}: ManagerLayoutProps) {
  const session = await requireManager();

  return (
    <AuthenticatedShell
      header={
        <div className="flex w-full flex-col gap-sm md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/manager"
              className="font-heading text-lg font-semibold text-text-strong"
            >
              Skill Forge
            </Link>
            <p className="mt-2xs text-sm text-text-soft">
              Manager dashboard
            </p>
          </div>
          <div className="flex items-center gap-sm">
            <AppPreferencesActions />
            <Button variant="subtle" size="sm" asChild>
              <Link href="/manager">Organization overview</Link>
            </Button>
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
                ariaLabel="Manager dashboard navigation"
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
