import Link from "next/link";
import type { ReactNode } from "react";

import { getDefaultRouteForUserType, requireAuth } from "@/lib/auth/auth";
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

type NavItem = {
  href: string;
  label: string;
};

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await requireAuth();
  const homeHref = getDefaultRouteForUserType(session.user.userType);
  const roleLabel =
    session.user.userType === "MANAGER"
      ? "Manager dashboard"
      : session.user.userType === "ADMIN"
        ? "Admin dashboard"
        : "Learner dashboard";
  const roleNavItems: NavItem[] = [
    { href: homeHref, label: "Dashboard" },
    { href: "/courses", label: "Courses" },
  ];

  return (
    <AuthenticatedShell
      header={
        <div className="flex w-full items-center justify-between gap-md">
          <div className="min-w-0">
            <Link
              href={homeHref}
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
                items={roleNavItems}
                ariaLabel={`${roleLabel} navigation`}
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
