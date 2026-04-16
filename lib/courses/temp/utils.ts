import type { AppCourse } from "@/lib/courses/temp/types";

export function filterCoursesByQuery(courses: AppCourse[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return courses;
  }

  return courses.filter((course) => {
    const normalizedTitle = course.name.toLowerCase();
    return normalizedTitle.includes(normalizedQuery);
  });
}
