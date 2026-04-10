import { Suspense } from "react";

import { CoursesLibraryList } from "@/components/courses/courses-library-list";
import { CourseList } from "@/components/dashboard/course-list";
import { CoursesUrlSearch } from "@/components/dashboard/courses-url-search";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionHeader,
  DashboardSectionEmptyState,
} from "@/components/dashboard/dashboard-section";
import { requireAuth } from "@/lib/auth/auth";
import { getCoursesPageDataAction } from "@/lib/courses/actions";
import { filterCoursesByQuery } from "@/lib/courses/utils";

type CoursesPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  await requireAuth();
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
            Browse the full course catalog available in the application.
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
  const coursesPageData = await getCoursesPageDataAction();
  const filteredCourses = filterCoursesByQuery(coursesPageData.courses, query);

  if (coursesPageData.courses.length === 0) {
    return (
      <DashboardSectionEmptyState
        title="No courses available"
        description="The course catalog is empty right now."
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

  return (
    <CoursesLibraryList
      courses={filteredCourses}
      bookmarkedCourseIds={coursesPageData.bookmarkedCourseIds}
      completedCourseIds={coursesPageData.completedCourseIds}
      userType={coursesPageData.userType}
    />
  );
}

function CoursesListFallback() {
  return (
    <DashboardSection>
      <DashboardSectionHeader
        title="All courses"
        description="Organization course catalog loaded from the database."
      />
      <DashboardSectionBody>
        <CourseList courses={[]} isLoading />
      </DashboardSectionBody>
    </DashboardSection>
  );
}
