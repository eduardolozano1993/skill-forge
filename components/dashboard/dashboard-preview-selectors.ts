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
  completedCourses: AppCourse[] | null,
  query: string,
) {
  const incompleteAssignedCourses =
    state.assignedCourses?.filter(
      (course) => !state.completedCourseIds.has(course.id),
    ) ?? null;
  const allVisibleCourses = [
    ...(incompleteAssignedCourses ?? []),
    ...(bookmarkedCourses ?? []),
  ];

  return {
    filteredAssignedCourses: getFilteredCourses(incompleteAssignedCourses, query),
    bookmarkedCourses: getUniqueMatchingCourses(allVisibleCourses, state.bookmarkedCourseIds),
    completedCourses: getUniqueMatchingCourses(
      completedCourses ?? [],
      state.completedCourseIds,
    ),
    assignedProgress: getCourseProgressCount(
      state.assignedCourses,
      state.completedCourseIds,
    ),
  };
}
