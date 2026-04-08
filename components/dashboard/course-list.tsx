import { CourseCard, CourseCardSkeleton } from "@/components/dashboard/course-card";
import { DashboardListLayout } from "@/components/dashboard/dashboard-list-layout";
import type { DashboardCourse } from "@/app/(app)/dashboard/mock-data";

type CourseListProps = {
  courses: DashboardCourse[];
  isLoading?: boolean;
  favoriteCourseIds?: Set<string>;
  onFavoriteToggle?: (course: DashboardCourse) => void;
};

export function CourseList({
  courses,
  isLoading = false,
  favoriteCourseIds,
  onFavoriteToggle,
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
          isFavorite={favoriteCourseIds?.has(course.id)}
          onFavoriteToggle={onFavoriteToggle ? () => onFavoriteToggle(course) : undefined}
        />
      ))}
    </DashboardListLayout>
  );
}
