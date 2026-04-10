"use client";

import type { KeyboardEvent, MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, Building2, CheckCircle2, PlayCircle } from "lucide-react";

import {
  DashboardItemBody,
  DashboardItemHeader,
  DashboardItemShell,
} from "@/components/dashboard/dashboard-item-shell";
import { CardDescription, CardTitle } from "@/components/ui/card";

type CourseCardProps = {
  title: string;
  summary: string;
  href?: string;
  isBookmarked?: boolean;
  isCompleted?: boolean;
  isAssigned?: boolean;
  actionsDisabled?: boolean;
  showBookmarkAction?: boolean;
  showCompletedAction?: boolean;
  onBookmarkToggle?: () => void;
  onCompletedToggle?: () => void;
};

export function CourseCard({
  title,
  summary,
  href,
  isBookmarked = false,
  isCompleted = false,
  isAssigned = false,
  actionsDisabled = false,
  showBookmarkAction,
  showCompletedAction,
  onBookmarkToggle,
  onCompletedToggle,
}: CourseCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isClickable = Boolean(href);
  const showCourseActions = pathname.startsWith("/courses");
  const showOrganizationIcon = isAssigned && showCourseActions;
  const shouldShowBookmarkAction =
    showBookmarkAction ?? showCourseActions;
  const shouldShowCompletedAction = showCompletedAction ?? true;
  const showBookmarkIcon =
    shouldShowBookmarkAction && !showOrganizationIcon && isBookmarked;

  function handleCardActivate() {
    if (!href) {
      return;
    }

    router.push(href);
  }

  function handleActionClick(
    event: MouseEvent<HTMLButtonElement>,
    action?: () => void,
  ) {
    event.stopPropagation();
    action?.();
  }

  return (
    <DashboardItemShell
      className={
        isClickable
          ? "min-w-0 cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 hover:border-[hsl(var(--brand)/0.4)] hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand)/0.35)] active:translate-y-0 active:scale-[0.99]"
          : "min-w-0"
      }
      role={isClickable ? "link" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleCardActivate : undefined}
      onKeyDown={
        isClickable
          ? (event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCardActivate();
              }
            }
          : undefined
      }
    >
      <DashboardItemHeader className={isClickable ? "relative" : undefined}>
        <div className="min-w-0 space-y-sm">
          <div className="flex items-center justify-between gap-sm">
            <div className="flex min-w-0 items-center gap-xs text-xs font-medium uppercase tracking-[0.12em] text-brand">
              <PlayCircle className="size-3.5" />
              <span>Course</span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {showOrganizationIcon ? (
                <span
                  aria-label="Assigned to your organization"
                  title="Assigned to your organization"
                  className="rounded-full p-1 text-brand"
                >
                  <Building2 className="size-4" />
                </span>
              ) : null}
              {showBookmarkIcon && onBookmarkToggle ? (
                <button
                  type="button"
                  disabled={actionsDisabled}
                  aria-label="Remove bookmark"
                  onClick={(event) =>
                    handleActionClick(event, onBookmarkToggle)
                  }
                  className="rounded-full p-1 text-amber-400 transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Bookmark
                    className="size-4"
                    fill="currentColor"
                  />
                </button>
              ) : null}
              {shouldShowCompletedAction && onCompletedToggle ? (
                <button
                  type="button"
                  disabled={actionsDisabled}
                  aria-label={
                    isCompleted
                      ? "Mark course as incomplete"
                      : "Mark course as complete"
                  }
                  onClick={(event) =>
                    handleActionClick(event, onCompletedToggle)
                  }
                  className="rounded-full p-1 transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2
                    className={
                      isCompleted
                        ? "size-4 text-emerald-500"
                        : "size-4 text-text-soft"
                    }
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
        <CardDescription className="line-clamp-3 text-sm leading-5">
          {summary}
        </CardDescription>
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
