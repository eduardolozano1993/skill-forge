import { Bookmark, CheckCircle2, Clock3, PlayCircle } from "lucide-react";

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
  isBookmarked?: boolean;
  isCompleted?: boolean;
  onBookmarkToggle?: () => void;
  onCompletedToggle?: () => void;
};

export function CourseCard({
  title,
  summary,
  dueDateLabel,
  isBookmarked = false,
  isCompleted = false,
  onBookmarkToggle,
  onCompletedToggle,
}: CourseCardProps) {
  return (
    <DashboardItemShell className="min-w-0">
      <DashboardItemHeader>
        <div className="min-w-0 space-y-sm">
          <div className="flex items-center justify-between gap-sm">
            <div className="flex min-w-0 items-center gap-xs text-xs font-medium uppercase tracking-[0.12em] text-brand">
              <PlayCircle className="size-3.5" />
              <span>Course</span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {onBookmarkToggle ? (
                <button
                  type="button"
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  onClick={onBookmarkToggle}
                  className="rounded-full p-1 text-amber-400 transition-colors hover:bg-brand-soft"
                >
                  <Bookmark className="size-4" fill={isBookmarked ? "currentColor" : "none"} />
                </button>
              ) : null}
              {onCompletedToggle ? (
                <button
                  type="button"
                  aria-label={isCompleted ? "Mark course as incomplete" : "Mark course as complete"}
                  onClick={onCompletedToggle}
                  className="rounded-full p-1 transition-colors hover:bg-brand-soft"
                >
                  <CheckCircle2
                    className={isCompleted ? "size-4 text-emerald-500" : "size-4 text-text-soft"}
                  />
                </button>
              ) : null}
            </div>
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
        <div className="min-w-0 space-y-sm">
          <div className="flex items-center justify-between gap-sm">
            <div className="flex items-center gap-xs">
              <div className="h-3.5 w-3.5 rounded-full bg-surface-muted" />
              <div className="h-3 w-16 rounded bg-surface-muted" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-6 w-6 rounded-full bg-surface-muted" />
              <div className="h-6 w-6 rounded-full bg-surface-muted" />
            </div>
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
