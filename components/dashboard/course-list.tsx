import { CourseCard, CourseCardSkeleton } from "@/components/dashboard/course-card";
import { DashboardListLayout } from "@/components/dashboard/dashboard-list-layout";
import type { DashboardCourse } from "@/app/(app)/dashboard/mock-data";

type CourseListProps = {
  courses: DashboardCourse[];
  isLoading?: boolean;
};

export function CourseList({ courses, isLoading = false }: CourseListProps) {
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
        <CourseCard key={course.id} {...course} />
      ))}
    </DashboardListLayout>
  );
}
