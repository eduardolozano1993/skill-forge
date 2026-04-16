import {
  CourseCard,
  CourseCardSkeleton,
} from "@/components/dashboard/course-card";
import { DashboardListLayout } from "@/components/dashboard/dashboard-list-layout";
import type { AppCourse } from "@/lib/courses/temp/types";

type CourseListProps = {
  courses: AppCourse[];
  isLoading?: boolean;
  showBookmarkAction?: boolean;
  showCompletedAction?: boolean;
  onBookmarkToggle?: (course: AppCourse) => void;
  onCompletedToggle?: (course: AppCourse) => void;
};

export function CourseList({
  courses,
  isLoading = false,
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
          isBookmarked={course.isBookmarked}
          isCompleted={course.isCompleted}
          isAssigned={course.isAssigned}
          // actionsDisabled={pendingCourseIds?.has(course.id)}
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
