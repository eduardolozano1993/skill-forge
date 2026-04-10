import type { DashboardPreviewState } from "@/components/dashboard/dashboard-preview-state";
import type { AppCourse } from "@/lib/courses/types";
import { filterCoursesByQuery } from "@/lib/courses/utils";

export function getFilteredCourses(courses: AppCourse[] | null, query: string) {
  if (!courses) {
    return null;
  }

  return filterCoursesByQuery(courses, query);
}

export function getUniqueMatchingCourses(
  courses: AppCourse[],
  selectedCourseIds: Set<number>,
) {
  return courses.filter(
    (course, index, items) =>
      selectedCourseIds.has(course.id) &&
      items.findIndex((item) => item.id === course.id) === index,
  );
}

export function getCourseProgressCount(
  courses: AppCourse[] | null,
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
  bookmarkedCourses: AppCourse[] | null,
  query: string,
) {
  const allVisibleCourses = [
    ...(state.assignedCourses ?? []),
    ...(bookmarkedCourses ?? []),
  ];

  return {
    filteredAssignedCourses: getFilteredCourses(state.assignedCourses, query),
    bookmarkedCourses: getUniqueMatchingCourses(allVisibleCourses, state.bookmarkedCourseIds),
    completedCourses: getUniqueMatchingCourses(allVisibleCourses, state.completedCourseIds),
    assignedProgress: getCourseProgressCount(
      state.assignedCourses,
      state.completedCourseIds,
    ),
  };
}
