import { Clock3, PlayCircle } from "lucide-react";

import {
  DashboardItemBody,
  DashboardItemHeader,
  DashboardItemShell,
} from "@/components/dashboard/dashboard-item-shell";
import { CardDescription, CardTitle } from "@/components/ui/card";

type CourseCardProps = {
  title: string;
  summary: string;
  dueDateLabel: string;
};

export function CourseCard({
  title,
  summary,
  dueDateLabel,
}: CourseCardProps) {
  return (
    <DashboardItemShell className="min-w-0">
      <DashboardItemHeader>
        <div className="min-w-0 space-y-xs">
          <div className="flex items-center gap-xs text-xs font-medium uppercase tracking-[0.12em] text-brand">
            <PlayCircle className="size-3.5" />
            <span>Course</span>
          </div>
          <CardTitle className="line-clamp-2 font-heading text-lg text-text-strong">
            {title}
          </CardTitle>
        </div>
      </DashboardItemHeader>
      <DashboardItemBody className="space-y-sm p-lg pt-0 text-left">
        <CardDescription className="line-clamp-3 text-sm leading-5">{summary}</CardDescription>
        <div className="flex w-full items-center justify-start gap-xs self-start text-left text-xs text-text-soft">
          <Clock3 className="size-3.5 text-brand" />
          <span>Due {dueDateLabel}</span>
        </div>
      </DashboardItemBody>
    </DashboardItemShell>
  );
}

export function CourseCardSkeleton() {
  return (
    <DashboardItemShell className="min-w-0 animate-pulse">
      <DashboardItemHeader>
        <div className="min-w-0 space-y-xs">
          <div className="flex items-center gap-xs">
            <div className="h-3.5 w-3.5 rounded-full bg-surface-muted" />
            <div className="h-3 w-16 rounded bg-surface-muted" />
          </div>
          <div className="space-y-xs">
            <div className="h-6 w-3/4 rounded bg-surface-muted" />
            <div className="h-6 w-1/2 rounded bg-surface-muted" />
          </div>
        </div>
      </DashboardItemHeader>
      <DashboardItemBody className="space-y-sm p-lg pt-0 text-left">
        <div className="space-y-xs">
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-5/6 rounded bg-surface-muted" />
          <div className="h-4 w-2/3 rounded bg-surface-muted" />
        </div>
        <div className="flex items-center gap-xs">
          <div className="h-3.5 w-3.5 rounded-full bg-surface-muted" />
          <div className="h-3 w-20 rounded bg-surface-muted" />
        </div>
      </DashboardItemBody>
    </DashboardItemShell>
  );
}
