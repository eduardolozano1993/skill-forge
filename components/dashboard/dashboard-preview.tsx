"use client";

import Link from "next/link";
import { useDeferredValue, useReducer } from "react";

import { type DashboardActivity } from "@/app/(app)/dashboard/mock-data";
import { ActivityList } from "@/components/dashboard/activity-list";
import { DashboardBookmarkDialog } from "@/components/dashboard/dashboard-bookmark-dialog";
import { DashboardCourseSection } from "@/components/dashboard/dashboard-course-section";
import { CourseList } from "@/components/dashboard/course-list";
import { CourseSearchInput } from "@/components/dashboard/course-search-input";
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
import { getDashboardPreviewCollections } from "@/components/dashboard/dashboard-preview-selectors";
import { Button } from "@/components/ui/button";
import { type MockCourse } from "@/lib/mock-courses";

type DashboardPreviewProps = {
  assignedCourses: MockCourse[] | null;
  recommendedCourses: MockCourse[] | null;
  bookmarkedCourses: MockCourse[] | null;
  recentActivity: DashboardActivity[] | null;
};

export function DashboardPreview({
  assignedCourses,
  recommendedCourses,
  bookmarkedCourses,
  recentActivity,
}: DashboardPreviewProps) {
  const [state, dispatch] = useReducer(
    dashboardPreviewReducer,
    {
      assignedCourses,
      recommendedCourses,
      bookmarkedCourses,
    },
    createDashboardPreviewInitialState,
  );
  const deferredSearchQuery = useDeferredValue(state.searchQuery);
  const {
    filteredAssignedCourses,
    filteredRecommendedCourses,
    bookmarkedCourses: bookmarkedCourseList,
    completedCourses,
    assignedProgress,
    recommendedProgress,
  } = getDashboardPreviewCollections(state, bookmarkedCourses, deferredSearchQuery);

  return (
    <>
      <DashboardSection>
        <DashboardSectionHeader
          title="Course search"
          description="Filter assigned and recommended courses by title or summary."
        />
        <DashboardSectionBody>
          <CourseSearchInput
            label="Search assigned and recommended courses"
            placeholder="Search assigned and recommended courses"
            value={state.searchQuery}
            onChange={(value) => dispatch({ type: "search_changed", value })}
          />
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardCourseSection
        title="Assigned courses"
        description="Repeatable compact cards with stable ids from the mock data file."
        courses={filteredAssignedCourses}
        emptyTitle="No assigned courses match"
        emptyDescription="Try a different search term to find assigned courses."
        errorTitle="Assigned courses unavailable"
        errorDescription="This section failed to load. The rest of the dashboard is still available."
        bookmarkedCourseIds={state.bookmarkedCourseIds}
        completedCourseIds={state.completedCourseIds}
        onBookmarkToggle={(course) => dispatch({ type: "bookmark_added", course })}
        onCompletedToggle={(course) => dispatch({ type: "course_completion_toggled", course })}
        action={
          <Button size="sm" variant="subtle">
            View all
          </Button>
        }
        progress={assignedProgress}
      />

      <DashboardCourseSection
        title="Recommended courses"
        description="Same card system, different collection."
        courses={filteredRecommendedCourses}
        emptyTitle="No recommended courses match"
        emptyDescription="Try a different search term to find recommendations."
        errorTitle="Recommended courses unavailable"
        errorDescription="Recommendations could not be loaded right now."
        bookmarkedCourseIds={state.bookmarkedCourseIds}
        completedCourseIds={state.completedCourseIds}
        onBookmarkToggle={(course) => dispatch({ type: "bookmark_added", course })}
        onCompletedToggle={(course) => dispatch({ type: "course_completion_toggled", course })}
        progress={recommendedProgress}
      />

      <DashboardSection>
        <DashboardSectionHeader
          title="Bookmarked courses"
          description="Saved courses you want to revisit quickly."
        />
        <DashboardSectionBody>
          {bookmarkedCourseList.length > 0 ? (
            <CourseList
              courses={bookmarkedCourseList}
              bookmarkedCourseIds={state.bookmarkedCourseIds}
              completedCourseIds={state.completedCourseIds}
              onBookmarkToggle={(course) =>
                dispatch({ type: "bookmark_removal_requested", course })
              }
              onCompletedToggle={(course) =>
                dispatch({ type: "course_completion_toggled", course })
              }
            />
          ) : (
            <DashboardSectionEmptyState
              title="No bookmarked courses yet"
              description="Courses you bookmark for later will appear here."
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Completed courses"
          description="Courses you have marked as completed across your dashboard."
        />
        <DashboardSectionBody>
          {completedCourses.length > 0 ? (
            <CourseList
              courses={completedCourses}
              bookmarkedCourseIds={state.bookmarkedCourseIds}
              completedCourseIds={state.completedCourseIds}
              onBookmarkToggle={(course) => dispatch({ type: "bookmark_added", course })}
              onCompletedToggle={(course) =>
                dispatch({ type: "course_completion_toggled", course })
              }
            />
          ) : (
            <DashboardSectionEmptyState
              title="No completed courses yet"
              description="Completed courses will appear here once you mark them done."
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

      <DashboardBookmarkDialog
        course={state.pendingBookmarkRemoval}
        onCancel={() => dispatch({ type: "bookmark_removal_cancelled" })}
        onConfirm={() => dispatch({ type: "bookmark_removal_confirmed" })}
      />
    </>
  );
}
