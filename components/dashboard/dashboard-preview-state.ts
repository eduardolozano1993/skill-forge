import type { DashboardCourse } from "@/app/(app)/dashboard/mock-data";

type DashboardPreviewStateInput = {
  assignedCourses: DashboardCourse[] | null;
  recommendedCourses: DashboardCourse[] | null;
  bookmarkedCourses: DashboardCourse[] | null;
};

export type DashboardPreviewState = {
  searchQuery: string;
  debouncedSearchQuery: string;
  assignedCourses: DashboardCourse[] | null;
  recommendedCourses: DashboardCourse[] | null;
  bookmarkedCourseIds: Set<string>;
  completedCourseIds: Set<string>;
  pendingBookmarkRemoval: DashboardCourse | null;
};

export type DashboardPreviewAction =
  | { type: "search_changed"; value: string }
  | { type: "search_debounced" }
  | { type: "bookmark_added"; course: DashboardCourse }
  | { type: "bookmark_removal_requested"; course: DashboardCourse }
  | { type: "bookmark_removal_confirmed" }
  | { type: "bookmark_removal_cancelled" }
  | { type: "course_completion_toggled"; course: DashboardCourse };

export function createDashboardPreviewInitialState({
  assignedCourses,
  recommendedCourses,
  bookmarkedCourses,
}: DashboardPreviewStateInput): DashboardPreviewState {
  return {
    searchQuery: "",
    debouncedSearchQuery: "",
    assignedCourses,
    recommendedCourses,
    bookmarkedCourseIds: new Set((bookmarkedCourses ?? []).map((course) => course.id)),
    completedCourseIds: new Set<string>(),
    pendingBookmarkRemoval: null,
  };
}

export function dashboardPreviewReducer(
  state: DashboardPreviewState,
  action: DashboardPreviewAction,
): DashboardPreviewState {
  switch (action.type) {
    case "search_changed":
      return {
        ...state,
        searchQuery: action.value,
      };
    case "search_debounced":
      return {
        ...state,
        debouncedSearchQuery: state.searchQuery,
      };
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
