import type { ReactNode } from "react";

type DashboardListLayoutProps = {
  children: ReactNode;
  variant: "course-grid" | "activity-stack";
};

const layoutByVariant = {
  "course-grid": "grid gap-md sm:grid-cols-2 xl:grid-cols-4",
  "activity-stack": "space-y-sm",
} as const;

export function DashboardListLayout({
  children,
  variant,
}: DashboardListLayoutProps) {
  return <div className={layoutByVariant[variant]}>{children}</div>;
}
