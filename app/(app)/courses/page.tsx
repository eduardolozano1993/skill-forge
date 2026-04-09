import { Suspense } from "react";

import { CourseList } from "@/components/dashboard/course-list";
import { CoursesUrlSearch } from "@/components/dashboard/courses-url-search";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionHeader,
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
      <Suspense key={q} fallback={<CoursesListFallback />}>
        <CoursesListSection query={q} />
      </Suspense>
    </section>
  );
}

type CoursesListSectionProps = {
  query: string;
};

async function CoursesListSection({ query }: CoursesListSectionProps) {
  const courses = await getCourses();
  const filteredCourses = filterCoursesByQuery(courses, query);

  if (courses.length === 0) {
    return (
      <DashboardSectionEmptyState
        title="No courses available"
        description="The course catalog is empty right now. Add mock courses to populate this page."
      />
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <DashboardSectionEmptyState
        title="No courses match"
        description="Try a different search term to find courses in the catalog."
      />
    );
  }

  return <CourseList courses={filteredCourses} />;
}

function CoursesListFallback() {
  return (
    <DashboardSection>
      <DashboardSectionHeader
        title="All courses"
        description="Shared mock course cards for the catalog route."
      />
      <DashboardSectionBody>
        <CourseList courses={[]} isLoading />
      </DashboardSectionBody>
    </DashboardSection>
  );
}
