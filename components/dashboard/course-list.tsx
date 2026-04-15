import {
  CourseCard,
  CourseCardSkeleton,
} from "@/components/dashboard/course-card";
import { DashboardListLayout } from "@/components/dashboard/dashboard-list-layout";
import type { AppCourse } from "@/lib/courses/temp/types";

type CourseListProps = {
  courses: AppCourse[];
  isLoading?: boolean;
  bookmarkedCourseIds?: Set<number>;
  completedCourseIds?: Set<number>;
  pendingCourseIds?: Set<number>;
  showBookmarkAction?: boolean;
  showCompletedAction?: boolean;
  onBookmarkToggle?: (course: AppCourse) => void;
  onCompletedToggle?: (course: AppCourse) => void;
};

export function CourseList({
  courses,
  isLoading = false,
  bookmarkedCourseIds,
  completedCourseIds,
  pendingCourseIds,
  showBookmarkAction,
  showCompletedAction,
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
          actionsDisabled={pendingCourseIds?.has(course.id)}
          showBookmarkAction={showBookmarkAction}
          showCompletedAction={showCompletedAction}
          onBookmarkToggle={
            onBookmarkToggle ? () => onBookmarkToggle(course) : undefined
          }
          onCompletedToggle={
            onCompletedToggle ? () => onCompletedToggle(course) : undefined
          }
        />
      ))}
    </DashboardListLayout>
  );
}
