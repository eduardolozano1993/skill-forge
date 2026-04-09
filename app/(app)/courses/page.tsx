import { CourseList } from "@/components/dashboard/course-list";
import { CoursesUrlSearch } from "@/components/dashboard/courses-url-search";
import {
  DashboardSectionEmptyState,
} from "@/components/dashboard/dashboard-section";
import { filterCoursesByQuery, getCourses } from "@/lib/mock-courses";

type CoursesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { q = "" } = await searchParams;
  const courses = await getCourses();
  const filteredCourses = filterCoursesByQuery(courses, q);

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Courses</p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            Course library
          </h1>
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            Browse the full mock catalog that powers assigned and recommended learning on the
            dashboard.
          </p>
        </div>
      </header>
      <CoursesUrlSearch query={q} />
      {courses.length === 0 ? (
        <DashboardSectionEmptyState
          title="No courses available"
          description="The course catalog is empty right now. Add mock courses to populate this page."
        />
      ) : filteredCourses.length > 0 ? (
        <CourseList courses={filteredCourses} />
      ) : (
        <DashboardSectionEmptyState
          title="No courses match"
          description="Try a different search term to find courses in the catalog."
        />
      )}
    </section>
  );
}
