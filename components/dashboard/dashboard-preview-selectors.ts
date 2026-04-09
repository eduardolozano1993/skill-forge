import type { DashboardPreviewState } from "@/components/dashboard/dashboard-preview-state";
import { filterCoursesByQuery, type MockCourse } from "@/lib/mock-courses";

export function getFilteredCourses(courses: MockCourse[] | null, query: string) {
  if (!courses) {
    return null;
  }

  return filterCoursesByQuery(courses, query);
}

export function getUniqueMatchingCourses(
  courses: MockCourse[],
  selectedCourseIds: Set<number>,
) {
  return courses.filter(
    (course, index, items) =>
      selectedCourseIds.has(course.id) &&
      items.findIndex((item) => item.id === course.id) === index,
  );
}

export function getCourseProgressCount(
  courses: MockCourse[] | null,
  completedCourseIds: Set<number>,
) {
  const total = courses?.length ?? 0;
  const completed = courses?.filter((course) => completedCourseIds.has(course.id)).length ?? 0;

  return {
    completed,
    total,
  };
}

export function getDashboardPreviewCollections(
  state: DashboardPreviewState,
  bookmarkedCourses: MockCourse[] | null,
  query: string,
) {
  const allVisibleCourses = [
    ...(state.assignedCourses ?? []),
    ...(state.recommendedCourses ?? []),
    ...(bookmarkedCourses ?? []),
  ];

  return {
    filteredAssignedCourses: getFilteredCourses(state.assignedCourses, query),
    filteredRecommendedCourses: getFilteredCourses(state.recommendedCourses, query),
    bookmarkedCourses: getUniqueMatchingCourses(allVisibleCourses, state.bookmarkedCourseIds),
    completedCourses: getUniqueMatchingCourses(allVisibleCourses, state.completedCourseIds),
    assignedProgress: getCourseProgressCount(
      state.assignedCourses,
      state.completedCourseIds,
    ),
    recommendedProgress: getCourseProgressCount(
      state.recommendedCourses,
      state.completedCourseIds,
    ),
  };
}
