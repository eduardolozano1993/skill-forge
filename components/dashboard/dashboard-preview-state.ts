import type { CourseDetail } from "@/lib/courses/types";

type DashboardPreviewStateInput = {
  assignedCourses: CourseDetail[] | null;
  bookmarkedCourses: CourseDetail[] | null;
  completedCourses: CourseDetail[] | null;
};

export type DashboardPreviewState = {
  assignedCourses: CourseDetail[] | null;
  bookmarkedCourseIds: Set<number>;
  completedCourseIds: Set<number>;
  pendingBookmarkRemoval: CourseDetail | null;
};

export type DashboardPreviewAction =
  | { type: "bookmark_added"; course: CourseDetail }
  | { type: "bookmark_removed"; course: CourseDetail }
  | { type: "bookmark_removal_requested"; course: CourseDetail }
  | { type: "bookmark_removal_cancelled" }
  | { type: "course_completion_toggled"; course: CourseDetail };

export function createDashboardPreviewInitialState({
  assignedCourses,
  bookmarkedCourses,
  completedCourses,
}: DashboardPreviewStateInput): DashboardPreviewState {
  return {
    assignedCourses,
    bookmarkedCourseIds: new Set(
      (bookmarkedCourses ?? []).map((course) => course.id),
    ),
    completedCourseIds: new Set(
      (completedCourses ?? []).map((course) => course.id),
    ),
    pendingBookmarkRemoval: null,
  };
}

export function dashboardPreviewReducer(
  state: DashboardPreviewState,
  action: DashboardPreviewAction,
): DashboardPreviewState {
  switch (action.type) {
    case "bookmark_added": {
      const nextBookmarkedCourseIds = new Set(state.bookmarkedCourseIds);
      nextBookmarkedCourseIds.add(action.course.id);
      return {
        ...state,
        bookmarkedCourseIds: nextBookmarkedCourseIds,
      };
    }
    case "bookmark_removal_requested":
      return {
        ...state,
        pendingBookmarkRemoval: action.course,
      };
    case "bookmark_removed": {
      const nextBookmarkedCourseIds = new Set(state.bookmarkedCourseIds);
      nextBookmarkedCourseIds.delete(action.course.id);

      return {
        ...state,
        bookmarkedCourseIds: nextBookmarkedCourseIds,
        pendingBookmarkRemoval: null,
      };
    }
    case "bookmark_removal_cancelled":
      return {
        ...state,
        pendingBookmarkRemoval: null,
      };
    case "course_completion_toggled": {
      const nextCompletedCourseIds = new Set(state.completedCourseIds);
      if (nextCompletedCourseIds.has(action.course.id)) {
        nextCompletedCourseIds.delete(action.course.id);
      } else {
        nextCompletedCourseIds.add(action.course.id);
      }
      return {
        ...state,
        completedCourseIds: nextCompletedCourseIds,
      };
    }
    default:
      return state;
  }
}
