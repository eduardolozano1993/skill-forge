"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  type DashboardActivity,
  type DashboardCourse,
} from "@/app/(app)/dashboard/mock-data";
import { ActivityList } from "@/components/dashboard/activity-list";
import { CourseList } from "@/components/dashboard/course-list";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [assignedState] = useState<DashboardCourse[] | null>(assignedCourses);
  const [recommendedState, setRecommendedState] = useState<DashboardCourse[] | null>(
    recommendedCourses,
  );
  const [favoriteCourseIds, setFavoriteCourseIds] = useState<Set<string>>(
    () => new Set((favoriteCourses ?? []).map((course) => course.id)),
  );
  const [pendingFavoriteRemoval, setPendingFavoriteRemoval] = useState<DashboardCourse | null>(
    null,
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const normalizedSearch = debouncedSearchQuery.trim().toLowerCase();

  const filteredAssignedCourses =
    !assignedState || !normalizedSearch
      ? assignedState
      : assignedState.filter((course) =>
          `${course.title} ${course.summary}`.toLowerCase().includes(normalizedSearch),
        );

  const filteredRecommendedCourses =
    !recommendedState || !normalizedSearch
      ? recommendedState
      : recommendedState.filter((course) =>
          `${course.title} ${course.summary}`.toLowerCase().includes(normalizedSearch),
        );

  const allVisibleCourses = [
    ...(assignedState ?? []),
    ...(recommendedState ?? []),
    ...(favoriteCourses ?? []),
  ];

  const favoriteState =
    allVisibleCourses.filter(
      (course, index, courses) =>
        favoriteCourseIds.has(course.id) &&
        courses.findIndex((item) => item.id === course.id) === index,
    ) ?? [];

  function addFavorite(course: DashboardCourse) {
    setFavoriteCourseIds((current) => new Set(current).add(course.id));
  }

  function requestFavoriteRemoval(course: DashboardCourse) {
    setPendingFavoriteRemoval(course);
  }

  function confirmFavoriteRemoval() {
    if (!pendingFavoriteRemoval) return;

    setFavoriteCourseIds((current) => {
      const next = new Set(current);
      next.delete(pendingFavoriteRemoval.id);
      return next;
    });
    setPendingFavoriteRemoval(null);
  }

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
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search assigned and recommended courses"
              className="w-full rounded-full border border-input bg-background px-md py-sm text-sm text-text-strong outline-none transition focus:border-brand focus:ring-2 focus:ring-[hsl(var(--brand)/0.2)]"
            />
          </label>
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Assigned courses"
          description="Repeatable compact cards with stable ids from the mock data file."
          action={<Button size="sm" variant="subtle">View all</Button>}
        />
        <DashboardSectionBody>
          {filteredAssignedCourses ? (
            filteredAssignedCourses.length > 0 ? (
            <CourseList
              courses={filteredAssignedCourses}
              favoriteCourseIds={favoriteCourseIds}
              onFavoriteToggle={addFavorite}
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
          title="Recommended courses"
          description="Same card system, different collection."
        />
        <DashboardSectionBody>
          {filteredRecommendedCourses ? (
            filteredRecommendedCourses.length > 0 ? (
            <CourseList
              courses={filteredRecommendedCourses}
              favoriteCourseIds={favoriteCourseIds}
              onFavoriteToggle={addFavorite}
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
              favoriteCourseIds={favoriteCourseIds}
              onFavoriteToggle={requestFavoriteRemoval}
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

      {pendingFavoriteRemoval ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-strong/20 p-md">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-lg shadow-card">
            <div className="space-y-xs">
              <h2 className="font-heading text-xl text-text-strong">Remove favorite course?</h2>
              <p className="text-sm text-text-soft">
                Remove{" "}
                <span className="font-medium text-text-strong">
                  {pendingFavoriteRemoval.title}
                </span>{" "}
                from your favorites list?
              </p>
            </div>
            <div className="mt-lg flex justify-end gap-sm">
              <Button variant="outline" onClick={() => setPendingFavoriteRemoval(null)}>
                Cancel
              </Button>
              <Button onClick={confirmFavoriteRemoval}>Ok</Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
