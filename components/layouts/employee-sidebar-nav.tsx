"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/tailwind/utils";

type NavItem = {
  href: string;
  label: string;
};

type EmployeeSidebarNavProps = {
  items: NavItem[];
  ariaLabel?: string;
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveHref(pathname: string, items: NavItem[]) {
  return items.reduce<string | null>((activeHref, item) => {
    if (!isActivePath(pathname, item.href)) {
      return activeHref;
    }

    if (!activeHref || item.href.length > activeHref.length) {
      return item.href;
    }

    return activeHref;
  }, null);
}

export function EmployeeSidebarNav({
  items,
  ariaLabel = "Dashboard navigation",
}: EmployeeSidebarNavProps) {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname, items);

  return (
    <nav aria-label={ariaLabel}>
      <ul className="space-y-xs text-sm">
        {items.map((item) => {
          const isActive = activeHref === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative block rounded-lg px-md py-sm transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand)/0.35)]",
                  isActive
                    ? "bg-[hsl(var(--brand)/0.10)] text-brand shadow-[inset_0_0_0_1px_hsl(var(--brand)/0.18)]"
                    : "text-text-soft hover:bg-surface-muted hover:text-text-strong",
                )}
              >
                <span
                  className={cn(
                    "relative inline-block font-medium",
                    isActive &&
                      "underline decoration-[hsl(var(--brand))] decoration-1 underline-offset-4",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
