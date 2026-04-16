import {
  CourseCard,
  CourseCardSkeleton,
} from "@/components/dashboard/course-card";
import { DashboardListLayout } from "@/components/dashboard/dashboard-list-layout";
import type { CourseDetail } from "@/lib/courses/types";

type CourseListProps = {
  courses: CourseDetail[];
  isLoading?: boolean;
  bookmarkedCourseIds?: Set<number>;
  completedCourseIds?: Set<number>;
  pendingCourseIds?: Set<number>;
  showBookmarkAction?: boolean;
  showCompletedAction?: boolean;
  onBookmarkToggle?: (course: CourseDetail) => void;
  onCompletedToggle?: (course: CourseDetail) => void;
};

export function CourseList({
  courses,
  isLoading = false,
  bookmarkedCourseIds,
  completedCourseIds,
  pendingCourseIds,
  showBookmarkAction = false,
  showCompletedAction = false,
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
          name={course.name}
          summary={course.summary}
          href={`/courses/${course.id}`}
          isBookmarked={
            bookmarkedCourseIds?.has(course.id) ?? course.isBookmarked
          }
          isCompleted={completedCourseIds?.has(course.id) ?? course.isCompleted}
          isAssigned={course.isAssigned}
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
