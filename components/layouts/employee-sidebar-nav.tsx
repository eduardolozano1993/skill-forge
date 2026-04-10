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
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function EmployeeSidebarNav({ items }: EmployeeSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Learner dashboard navigation">
      <ul className="space-y-xs text-sm">
        {items.map((item) => {
          const isActive = isActivePath(pathname, item.href);

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
