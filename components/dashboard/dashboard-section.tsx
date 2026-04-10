import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/tailwind/utils";

type DashboardSectionProps = ComponentProps<"section"> & {
  children: ReactNode;
};

type DashboardSectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

type DashboardSectionBodyProps = {
  children: ReactNode;
  className?: string;
};

type DashboardSectionEmptyStateProps = {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
};

type DashboardSectionErrorStateProps = {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function DashboardSection({
  children,
  className,
  ...props
}: DashboardSectionProps) {
  return (
    <section
      {...props}
      className={cn(
        "rounded-xl border border-dashed border-border bg-surface/70 p-md md:p-lg",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function DashboardSectionHeader({
  title,
  description,
  action,
  className,
}: DashboardSectionHeaderProps) {
  return (
    <div
      className={cn("mb-md flex items-start justify-between gap-md", className)}
    >
      <div className="space-y-1">
        <h2 className="font-heading text-xl text-text-strong">{title}</h2>
        {description ? (
          <p className="text-sm text-text-soft">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function DashboardSectionBody({
  children,
  className,
}: DashboardSectionBodyProps) {
  return <div className={cn("min-w-0", className)}>{children}</div>;
}

export function DashboardSectionEmptyState({
  title,
  description,
  action,
  className,
}: DashboardSectionEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-surface p-lg text-left",
        className,
      )}
    >
      <div className="space-y-1">
        <h3 className="font-heading text-base text-text-strong">{title}</h3>
        <p className="text-sm text-text-soft">{description}</p>
      </div>
      {action ? <div className="mt-md">{action}</div> : null}
    </div>
  );
}

export function DashboardSectionErrorState({
  title,
  description,
  action,
  className,
}: DashboardSectionErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[hsl(var(--brand)/0.25)] bg-brand-soft p-lg text-left",
        className,
      )}
    >
      <div className="space-y-1">
        <h3 className="font-heading text-base text-text-strong">{title}</h3>
        <p className="text-sm text-text-soft">{description}</p>
      </div>
      {action ? <div className="mt-md">{action}</div> : null}
    </div>
  );
}
