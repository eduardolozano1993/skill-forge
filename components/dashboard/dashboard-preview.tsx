"use client";

import { useReducer } from "react";

import { DashboardBookmarkDialog } from "@/components/dashboard/dashboard-bookmark-dialog";
import { DashboardCourseSection } from "@/components/dashboard/dashboard-course-section";
import { CourseList } from "@/components/dashboard/course-list";
import {
  createDashboardPreviewInitialState,
  dashboardPreviewReducer,
} from "@/components/dashboard/dashboard-preview-state";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionEmptyState,
  DashboardSectionHeader,
} from "@/components/dashboard/dashboard-section";
import { getDashboardPreviewCollections } from "@/components/dashboard/dashboard-preview-selectors";
import { Button } from "@/components/ui/button";
import type { AppCourse } from "@/lib/courses/types";

type DashboardPreviewProps = {
  query: string;
  assignedCourses: AppCourse[] | null;
  bookmarkedCourses: AppCourse[] | null;
  completedCourses: AppCourse[] | null;
};

export function DashboardPreview({
  query,
  assignedCourses,
  bookmarkedCourses,
  completedCourses,
}: DashboardPreviewProps) {
  const [state, dispatch] = useReducer(
    dashboardPreviewReducer,
    {
      assignedCourses,
      bookmarkedCourses,
      completedCourses,
    },
    createDashboardPreviewInitialState,
  );
  const {
    filteredAssignedCourses,
    bookmarkedCourses: bookmarkedCourseList,
    completedCourses: completedCourseList,
    assignedProgress,
  } = getDashboardPreviewCollections(state, bookmarkedCourses, query);

  return (
    <>
      <DashboardCourseSection
        title="Assigned courses"
        description="Courses assigned to your organization."
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
          {completedCourseList.length > 0 ? (
            <CourseList
              courses={completedCourseList}
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

      <DashboardBookmarkDialog
        course={state.pendingBookmarkRemoval}
        onCancel={() => dispatch({ type: "bookmark_removal_cancelled" })}
        onConfirm={() => dispatch({ type: "bookmark_removal_confirmed" })}
      />
    </>
  );
}
