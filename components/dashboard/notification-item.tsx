import { BellDot } from "lucide-react";

import {
  DashboardItemBody,
  DashboardItemHeader,
  DashboardItemShell,
} from "@/components/dashboard/dashboard-item-shell";
import { CardDescription, CardTitle } from "@/components/ui/card";

type NotificationItemProps = {
  title: string;
  message: string;
  meta: string;
};

export function NotificationItem({ title, message, meta }: NotificationItemProps) {
  return (
    <DashboardItemShell>
      <DashboardItemHeader>
        <div className="flex items-start gap-sm">
          <div className="rounded-full bg-brand-soft p-xs text-brand-strong">
            <BellDot className="size-3.5" />
          </div>
          <div className="space-y-xs">
            <CardTitle className="font-heading text-base text-text-strong">{title}</CardTitle>
            <CardDescription className="text-xs uppercase tracking-[0.12em]">{meta}</CardDescription>
          </div>
        </div>
      </DashboardItemHeader>
      <DashboardItemBody>
        <p className="text-sm leading-5 text-text-soft">{message}</p>
      </DashboardItemBody>
    </DashboardItemShell>
  );
}

export function NotificationItemSkeleton() {
  return (
    <DashboardItemShell className="animate-pulse">
      <DashboardItemHeader>
        <div className="flex items-start gap-sm">
          <div className="h-7 w-7 rounded-full bg-surface-muted" />
          <div className="min-w-0 flex-1 space-y-xs">
            <div className="h-5 w-1/3 rounded bg-surface-muted" />
            <div className="h-3 w-24 rounded bg-surface-muted" />
          </div>
        </div>
      </DashboardItemHeader>
      <DashboardItemBody>
        <div className="space-y-xs">
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-4/5 rounded bg-surface-muted" />
        </div>
      </DashboardItemBody>
    </DashboardItemShell>
  );
}
