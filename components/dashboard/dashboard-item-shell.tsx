import type { HTMLAttributes, ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardItemShellProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

type DashboardItemHeaderProps = {
  children: ReactNode;
  className?: string;
};

type DashboardItemBodyProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardItemShell({ children, className, ...props }: DashboardItemShellProps) {
  return (
    <Card className={cn("h-full", className)} {...props}>
      {children}
    </Card>
  );
}

export function DashboardItemHeader({ children, className }: DashboardItemHeaderProps) {
  return <CardHeader className={cn("space-y-sm p-lg pb-sm", className)}>{children}</CardHeader>;
}

export function DashboardItemBody({ children, className }: DashboardItemBodyProps) {
  return <CardContent className={cn("px-lg pb-lg", className)}>{children}</CardContent>;
}
