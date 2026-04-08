"use client";

import Link from "next/link";
import { useEffect, useReducer } from "react";

import {
  type DashboardActivity,
  type DashboardCourse,
} from "@/app/(app)/dashboard/mock-data";
import { ActivityList } from "@/components/dashboard/activity-list";
import { CourseList } from "@/components/dashboard/course-list";
import {
  createDashboardPreviewInitialState,
  dashboardPreviewReducer,
} from "@/components/dashboard/dashboard-preview-state";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionEmptyState,
  DashboardSectionErrorState,
  DashboardSectionHeader,
} from "@/components/dashboard/dashboard-section";
import { Button } from "@/components/ui/button";

type DashboardPreviewProps = {
  assignedCourses: DashboardCourse[] | null;
  recommendedCourses: DashboardCourse[] | null;
  favoriteCourses: DashboardCourse[] | null;
  recentActivity: DashboardActivity[] | null;
};

export function DashboardPreview({
  assignedCourses,
  recommendedCourses,
  favoriteCourses,
  recentActivity,
}: DashboardPreviewProps) {
  const [state, dispatch] = useReducer(
    dashboardPreviewReducer,
    {
      assignedCourses,
      recommendedCourses,
      favoriteCourses,
    },
    createDashboardPreviewInitialState,
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      dispatch({ type: "search_debounced" });
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [state.searchQuery]);

  const normalizedSearch = state.debouncedSearchQuery.trim().toLowerCase();

  const filteredAssignedCourses =
    !state.assignedCourses || !normalizedSearch
      ? state.assignedCourses
      : state.assignedCourses.filter((course) =>
          `${course.title} ${course.summary}`.toLowerCase().includes(normalizedSearch),
        );

  const filteredRecommendedCourses =
    !state.recommendedCourses || !normalizedSearch
      ? state.recommendedCourses
      : state.recommendedCourses.filter((course) =>
          `${course.title} ${course.summary}`.toLowerCase().includes(normalizedSearch),
        );

  const allVisibleCourses = [
    ...(state.assignedCourses ?? []),
    ...(state.recommendedCourses ?? []),
    ...(favoriteCourses ?? []),
  ];

  const favoriteState =
    allVisibleCourses.filter(
      (course, index, courses) =>
        state.favoriteCourseIds.has(course.id) &&
        courses.findIndex((item) => item.id === course.id) === index,
    ) ?? [];

  const assignedCompletedCount =
    state.assignedCourses?.filter((course) => state.completedCourseIds.has(course.id)).length ?? 0;
  const assignedTotalCount = state.assignedCourses?.length ?? 0;
  const recommendedCompletedCount =
    state.recommendedCourses?.filter((course) => state.completedCourseIds.has(course.id)).length ??
    0;
  const recommendedTotalCount = state.recommendedCourses?.length ?? 0;

  return (
    <>
      <DashboardSection>
        <DashboardSectionHeader
          title="Course search"
          description="Filter assigned and recommended courses by title or summary."
        />
        <DashboardSectionBody>
          <label className="block">
            <span className="sr-only">Search courses</span>
            <input
              type="search"
              value={state.searchQuery}
              onChange={(event) =>
                dispatch({ type: "search_changed", value: event.target.value })
              }
              placeholder="Search assigned and recommended courses"
              className="w-full rounded-full border border-input bg-background px-md py-sm text-sm text-text-strong outline-none transition focus:border-brand focus:ring-2 focus:ring-[hsl(var(--brand)/0.2)]"
            />
          </label>
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title={
            <div className="flex items-center gap-sm">
              <span>Assigned courses</span>
              <span className="text-sm font-medium text-text-soft">
                {assignedCompletedCount}/{assignedTotalCount}
              </span>
            </div>
          }
          description="Repeatable compact cards with stable ids from the mock data file."
          action={<Button size="sm" variant="subtle">View all</Button>}
        />
        <DashboardSectionBody>
          {filteredAssignedCourses ? (
            filteredAssignedCourses.length > 0 ? (
            <CourseList
              courses={filteredAssignedCourses}
              favoriteCourseIds={state.favoriteCourseIds}
              completedCourseIds={state.completedCourseIds}
              onFavoriteToggle={(course) => dispatch({ type: "favorite_added", course })}
              onCompletedToggle={(course) =>
                dispatch({ type: "course_completion_toggled", course })
              }
            />
            ) : (
              <DashboardSectionEmptyState
                title="No assigned courses match"
                description="Try a different search term to find assigned courses."
              />
            )
          ) : (
            <DashboardSectionErrorState
              title="Assigned courses unavailable"
              description="This section failed to load. The rest of the dashboard is still available."
              action={
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard">Retry section</Link>
                </Button>
              }
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title={
            <div className="flex items-center gap-sm">
              <span>Recommended courses</span>
              <span className="text-sm font-medium text-text-soft">
                {recommendedCompletedCount}/{recommendedTotalCount}
              </span>
            </div>
          }
          description="Same card system, different collection."
        />
        <DashboardSectionBody>
          {filteredRecommendedCourses ? (
            filteredRecommendedCourses.length > 0 ? (
            <CourseList
              courses={filteredRecommendedCourses}
              favoriteCourseIds={state.favoriteCourseIds}
              completedCourseIds={state.completedCourseIds}
              onFavoriteToggle={(course) => dispatch({ type: "favorite_added", course })}
              onCompletedToggle={(course) =>
                dispatch({ type: "course_completion_toggled", course })
              }
            />
            ) : (
              <DashboardSectionEmptyState
                title="No recommended courses match"
                description="Try a different search term to find recommendations."
              />
            )
          ) : (
            <DashboardSectionErrorState
              title="Recommended courses unavailable"
              description="Recommendations could not be loaded right now."
              action={
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard">Retry section</Link>
                </Button>
              }
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Favorite courses"
          description="Saved courses you want to revisit quickly."
        />
        <DashboardSectionBody>
          {favoriteState.length > 0 ? (
            <CourseList
              courses={favoriteState}
              favoriteCourseIds={state.favoriteCourseIds}
              completedCourseIds={state.completedCourseIds}
              onFavoriteToggle={(course) =>
                dispatch({ type: "favorite_removal_requested", course })
              }
              onCompletedToggle={(course) =>
                dispatch({ type: "course_completion_toggled", course })
              }
            />
          ) : (
            <DashboardSectionEmptyState
              title="No favorite courses yet"
              description="Courses you save for later will appear here."
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Recent activity"
          description="Repeatable activity items with a dedicated loading state."
        />
        <DashboardSectionBody>
          {recentActivity ? (
            <ActivityList items={recentActivity} />
          ) : (
            <DashboardSectionErrorState
              title="Recent activity unavailable"
              description="Activity updates could not be loaded right now."
              action={
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard">Retry section</Link>
                </Button>
              }
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>

      {state.pendingFavoriteRemoval ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-strong/20 p-md">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-lg shadow-card">
            <div className="space-y-xs">
              <h2 className="font-heading text-xl text-text-strong">Remove favorite course?</h2>
              <p className="text-sm text-text-soft">
                Remove{" "}
                <span className="font-medium text-text-strong">
                  {state.pendingFavoriteRemoval.title}
                </span>{" "}
                from your favorites list?
              </p>
            </div>
            <div className="mt-lg flex justify-end gap-sm">
              <Button
                variant="outline"
                onClick={() => dispatch({ type: "favorite_removal_cancelled" })}
              >
                Cancel
              </Button>
              <Button onClick={() => dispatch({ type: "favorite_removal_confirmed" })}>
                Ok
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
