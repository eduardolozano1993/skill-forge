import type { MockCourse } from "@/lib/mock-courses";

type DashboardPreviewStateInput = {
  assignedCourses: MockCourse[] | null;
  recommendedCourses: MockCourse[] | null;
  bookmarkedCourses: MockCourse[] | null;
};

export type DashboardPreviewState = {
  assignedCourses: MockCourse[] | null;
  recommendedCourses: MockCourse[] | null;
  bookmarkedCourseIds: Set<number>;
  completedCourseIds: Set<number>;
  pendingBookmarkRemoval: MockCourse | null;
};

export type DashboardPreviewAction =
  | { type: "bookmark_added"; course: MockCourse }
  | { type: "bookmark_removal_requested"; course: MockCourse }
  | { type: "bookmark_removal_confirmed" }
  | { type: "bookmark_removal_cancelled" }
  | { type: "course_completion_toggled"; course: MockCourse };

export function createDashboardPreviewInitialState({
  assignedCourses,
  recommendedCourses,
  bookmarkedCourses,
}: DashboardPreviewStateInput): DashboardPreviewState {
  return {
    assignedCourses,
    recommendedCourses,
    bookmarkedCourseIds: new Set((bookmarkedCourses ?? []).map((course) => course.id)),
    completedCourseIds: new Set<number>(),
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
    case "bookmark_removal_confirmed": {
      if (!state.pendingBookmarkRemoval) {
        return state;
      }

      const nextBookmarkedCourseIds = new Set(state.bookmarkedCourseIds);
      nextBookmarkedCourseIds.delete(state.pendingBookmarkRemoval.id);

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
