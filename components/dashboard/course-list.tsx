import { CourseCard, CourseCardSkeleton } from "@/components/dashboard/course-card";
import { DashboardListLayout } from "@/components/dashboard/dashboard-list-layout";
import type { MockCourse } from "@/lib/mock-courses";

type CourseListProps = {
  courses: MockCourse[];
  isLoading?: boolean;
  bookmarkedCourseIds?: Set<number>;
  completedCourseIds?: Set<number>;
  onBookmarkToggle?: (course: MockCourse) => void;
  onCompletedToggle?: (course: MockCourse) => void;
};

export function CourseList({
  courses,
  isLoading = false,
  bookmarkedCourseIds,
  completedCourseIds,
  onBookmarkToggle,
  onCompletedToggle,
}: CourseListProps) {
  if (isLoading) {
    return (
      <DashboardListLayout variant="course-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <CourseCardSkeleton key={`course-skeleton-${index}`} />
        ))}
      </DashboardListLayout>
    );
  }

  return (
    <DashboardListLayout variant="course-grid">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          {...course}
          href={`/courses/${course.id}`}
          isBookmarked={bookmarkedCourseIds?.has(course.id)}
          isCompleted={completedCourseIds?.has(course.id)}
          onBookmarkToggle={onBookmarkToggle ? () => onBookmarkToggle(course) : undefined}
          onCompletedToggle={onCompletedToggle ? () => onCompletedToggle(course) : undefined}
        />
      ))}
    </DashboardListLayout>
  );
}
