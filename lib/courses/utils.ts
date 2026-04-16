import type { CourseDetail } from "@/lib/courses/types";

export function filterCoursesByQuery(courses: CourseDetail[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return courses;
  }

  return courses.filter((course) => {
    const normalizedTitle = course.name.toLowerCase();
    return normalizedTitle.includes(normalizedQuery);
  });
}
