import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function DashboardSection({
  title,
  description,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-dashed border-border bg-surface/70 p-lg",
        className,
      )}
    >
      <div className="mb-md space-y-1">
        <h2 className="font-heading text-xl text-text-strong">{title}</h2>
        <p className="text-sm text-text-soft">{description}</p>
      </div>
      {children}
    </section>
  );
}
