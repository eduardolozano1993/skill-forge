"use client";

import { startTransition, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";

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
import type { CourseDetail } from "@/lib/courses/types";
import {
  toggleCourseBookmarkAction,
  toggleCourseCompletionAction,
} from "@/lib/courses/actions";

type DashboardPreviewProps = {
  query: string;
  assignedCourses: CourseDetail[] | null;
  bookmarkedCourses: CourseDetail[] | null;
  completedCourses: CourseDetail[] | null;
};

export function DashboardPreview({
  query,
  assignedCourses,
  bookmarkedCourses,
  completedCourses,
}: DashboardPreviewProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    dashboardPreviewReducer,
    {
      assignedCourses,
      bookmarkedCourses,
      completedCourses,
    },
    createDashboardPreviewInitialState,
  );
  const [pendingCourseIds, setPendingCourseIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [mutationError, setMutationError] = useState<string | null>(null);
  const {
    filteredAssignedCourses,
    bookmarkedCourses: bookmarkedCourseList,
    completedCourses: completedCourseList,
    assignedProgress,
  } = getDashboardPreviewCollections(
    state,
    bookmarkedCourses,
    completedCourses,
    query,
  );
  const pendingBookmarkRemovalId = state.pendingBookmarkRemoval?.id ?? null;
  const pendingRemovalConfirm = useMemo(() => {
    if (!pendingBookmarkRemovalId) {
      return false;
    }

    return pendingCourseIds.has(pendingBookmarkRemovalId);
  }, [pendingBookmarkRemovalId, pendingCourseIds]);

  function updatePendingCourse(courseId: number, isPending: boolean) {
    setPendingCourseIds((current) => {
      const next = new Set(current);

      if (isPending) {
        next.add(courseId);
      } else {
        next.delete(courseId);
      }

      return next;
    });
  }

  function refreshDashboard() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleBookmarkAdd(course: CourseDetail) {
    setMutationError(null);
    dispatch({ type: "bookmark_added", course });
    updatePendingCourse(course.id, true);

    const result = await toggleCourseBookmarkAction(course.id);

    updatePendingCourse(course.id, false);

    if (result?.error) {
      dispatch({ type: "bookmark_removed", course });
      setMutationError(result.error);
      return;
    }

    refreshDashboard();
  }

  async function handleBookmarkRemovalConfirmed() {
    const course = state.pendingBookmarkRemoval;

    if (!course) {
      return;
    }

    setMutationError(null);
    dispatch({ type: "bookmark_removed", course });
    updatePendingCourse(course.id, true);

    const result = await toggleCourseBookmarkAction(course.id);

    updatePendingCourse(course.id, false);

    if (result?.error) {
      dispatch({ type: "bookmark_added", course });
      setMutationError(result.error);
      return;
    }

    refreshDashboard();
  }

  async function handleCompletionToggle(course: CourseDetail) {
    setMutationError(null);
    dispatch({ type: "course_completion_toggled", course });
    updatePendingCourse(course.id, true);

    const result = await toggleCourseCompletionAction(course.id);

    updatePendingCourse(course.id, false);

    if (result?.error) {
      dispatch({ type: "course_completion_toggled", course });
      setMutationError(result.error);
      return;
    }

    refreshDashboard();
  }

  return (
    <>
      {mutationError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-md py-sm text-sm text-destructive">
          {mutationError}
        </div>
      ) : null}

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
        pendingCourseIds={pendingCourseIds}
        onBookmarkToggle={handleBookmarkAdd}
        onCompletedToggle={handleCompletionToggle}
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
              pendingCourseIds={pendingCourseIds}
              showBookmarkAction
              showCompletedAction={false}
              onBookmarkToggle={(course) =>
                dispatch({ type: "bookmark_removal_requested", course })
              }
              onCompletedToggle={handleCompletionToggle}
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
              pendingCourseIds={pendingCourseIds}
              onBookmarkToggle={handleBookmarkAdd}
              onCompletedToggle={handleCompletionToggle}
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
        isSubmitting={pendingRemovalConfirm}
        onCancel={() => dispatch({ type: "bookmark_removal_cancelled" })}
        onConfirm={handleBookmarkRemovalConfirmed}
      />
    </>
  );
}
