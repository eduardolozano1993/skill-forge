import { CourseCard } from "@/components/dashboard/course-card";
import type { DashboardCourse } from "@/app/(app)/dashboard/mock-data";

type CourseListProps = {
  courses: DashboardCourse[];
  isLoading?: boolean;
};

export function CourseList({ courses, isLoading = false }: CourseListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-md sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={`course-skeleton-${index}`}
            className="h-40 animate-pulse rounded-lg border border-border bg-surface-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-md sm:grid-cols-2 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
}
