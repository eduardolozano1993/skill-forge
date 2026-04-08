import type { DashboardCourse } from "@/app/(app)/dashboard/mock-data";

type DashboardPreviewStateInput = {
  assignedCourses: DashboardCourse[] | null;
  recommendedCourses: DashboardCourse[] | null;
  favoriteCourses: DashboardCourse[] | null;
};

export type DashboardPreviewState = {
  searchQuery: string;
  debouncedSearchQuery: string;
  assignedCourses: DashboardCourse[] | null;
  recommendedCourses: DashboardCourse[] | null;
  favoriteCourseIds: Set<string>;
  completedCourseIds: Set<string>;
  pendingFavoriteRemoval: DashboardCourse | null;
};

export type DashboardPreviewAction =
  | { type: "search_changed"; value: string }
  | { type: "search_debounced" }
  | { type: "favorite_added"; course: DashboardCourse }
  | { type: "favorite_removal_requested"; course: DashboardCourse }
  | { type: "favorite_removal_confirmed" }
  | { type: "favorite_removal_cancelled" }
  | { type: "course_completion_toggled"; course: DashboardCourse };

export function createDashboardPreviewInitialState({
  assignedCourses,
  recommendedCourses,
  favoriteCourses,
}: DashboardPreviewStateInput): DashboardPreviewState {
  return {
    searchQuery: "",
    debouncedSearchQuery: "",
    assignedCourses,
    recommendedCourses,
    favoriteCourseIds: new Set((favoriteCourses ?? []).map((course) => course.id)),
    completedCourseIds: new Set<string>(),
    pendingFavoriteRemoval: null,
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
    case "favorite_added": {
      const nextFavoriteCourseIds = new Set(state.favoriteCourseIds);
      nextFavoriteCourseIds.add(action.course.id);
      return {
        ...state,
        favoriteCourseIds: nextFavoriteCourseIds,
      };
    }
    case "favorite_removal_requested":
      return {
        ...state,
        pendingFavoriteRemoval: action.course,
      };
    case "favorite_removal_confirmed": {
      if (!state.pendingFavoriteRemoval) {
        return state;
      }

      const nextFavoriteCourseIds = new Set(state.favoriteCourseIds);
      nextFavoriteCourseIds.delete(state.pendingFavoriteRemoval.id);

      return {
        ...state,
        favoriteCourseIds: nextFavoriteCourseIds,
        pendingFavoriteRemoval: null,
      };
    }
    case "favorite_removal_cancelled":
      return {
        ...state,
        pendingFavoriteRemoval: null,
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
