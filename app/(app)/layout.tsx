import Link from "next/link";
import type { ReactNode } from "react";

import { requireAuth } from "@/lib/auth/auth";
import { AppPreferencesActions } from "@/components/layouts/app-preferences-actions";
import { AuthenticatedShell } from "@/components/layouts/authenticated-shell";
import { ProfileMenu } from "@/components/layouts/profile-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
];

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await requireAuth();

  return (
    <AuthenticatedShell
      header={
        <div className="flex w-full flex-col gap-sm md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="font-heading text-lg font-semibold text-text-strong"
            >
              Skill Forge
            </Link>
            <p className="mt-2xs text-sm text-text-soft">Learner dashboard</p>
          </div>
          <div className="flex items-center gap-sm">
            <AppPreferencesActions />
            <Button size="sm">Resume course</Button>
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
              <nav aria-label="Learner dashboard navigation">
                <ul className="space-y-xs text-sm">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-md px-sm py-sm text-text-soft transition-colors hover:bg-surface-muted hover:text-text-strong"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
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
