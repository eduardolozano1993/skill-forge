export function getCourseByIdCacheKey(courseId: number) {
  return `courses:detail:${courseId}`;
}
