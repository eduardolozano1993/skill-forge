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
import { getCourses } from "@/lib/courses/services";
import { getSingleQueryParam, parsePageQueryParam } from "@/lib/table/utils";
import { requireAuth } from "@/lib/auth/auth";

type CoursesPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    page?: string | string[];
  }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = getSingleQueryParam(resolvedSearchParams.q);
  const page = parsePageQueryParam(resolvedSearchParams.page);

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Courses
        </p>
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
      <Suspense key={`${q}-${page}`} fallback={<CoursesListFallback />}>
        <CoursesListSection query={q} page={page} />
      </Suspense>
    </section>
  );
}

type CoursesListSectionProps = {
  query: string;
  page: number;
};

async function CoursesListSection({ query, page }: CoursesListSectionProps) {
  const session = await requireAuth();

  const { rows, search, pagination } = await getCourses(query, page);

  if (rows.length === 0) {
    return (
      <DashboardSectionEmptyState
        title="No courses available"
        description="The course catalog is empty right now."
      />
    );
  }

  if (rows.length === 0) {
    return (
      <DashboardSectionEmptyState
        title="No courses match"
        description="Try a different search term to find courses in the catalog."
      />
    );
  }

  return (
    <CoursesLibraryList
      courses={rows}
      userType={session.user.userType}
      pagination={pagination}
      search={search}
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
