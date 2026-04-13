import type { AppCourse } from "@/lib/courses/types";

export function normalizeCourseSearchQuery(query: string) {
  return query.trim().toLowerCase();
}

export function filterCoursesByQuery(courses: AppCourse[], query: string) {
  const normalizedQuery = normalizeCourseSearchQuery(query);

  if (!normalizedQuery) {
    return courses;
  }

  return courses.filter((course) => {
    const normalizedTitle = course.title.toLowerCase();
    const normalizedSummary = course.summary.toLowerCase();

    return (
      normalizedTitle.includes(normalizedQuery) ||
      normalizedSummary.includes(normalizedQuery)
    );
  });
}

export function getCourseContentParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
