import { Suspense } from "react";

import { DashboardCourseCollectionsFallback } from "@/components/dashboard/dashboard-course-collections-fallback";
import { DashboardUrlSearch } from "@/components/dashboard/dashboard-url-search";
import { DashboardPreview } from "@/components/dashboard/dashboard-preview";
import { requireEmployee } from "@/lib/auth/auth";
import { getDashboardCoursesAction } from "@/lib/courses/actions";

type DashboardPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await requireEmployee();
  const { q = "" } = await searchParams;

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Dashboard</p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            Collection preview
          </h1>
          <p className="mt-xs max-w-2xl text-base text-text-soft">
            Assigned, bookmarked, and completed courses are loaded from the database for the
            signed-in user.
          </p>
        </div>
      </header>
      <DashboardUrlSearch query={q} />
      <Suspense key={`dashboard-courses-${q}`} fallback={<DashboardCourseCollectionsFallback />}>
        <DashboardCourseCollections query={q} />
      </Suspense>
    </section>
  );
}

async function DashboardCourseCollections({ query }: { query: string }) {
  const dashboardCoursesResult = await Promise.allSettled([getDashboardCoursesAction()]);
  const dashboardCourses =
    dashboardCoursesResult[0]?.status === "fulfilled" ? dashboardCoursesResult[0].value : null;

  return (
    <DashboardPreview
      query={query}
      assignedCourses={dashboardCourses?.assignedCourses ?? null}
      bookmarkedCourses={dashboardCourses?.bookmarkedCourses ?? null}
      completedCourses={dashboardCourses?.completedCourses ?? null}
    />
  );
}
