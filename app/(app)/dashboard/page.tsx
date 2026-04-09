import { Suspense } from "react";

import { DashboardCourseCollectionsFallback } from "@/components/dashboard/dashboard-course-collections-fallback";
import { DashboardUrlSearch } from "@/components/dashboard/dashboard-url-search";
import { DashboardPreview } from "@/components/dashboard/dashboard-preview";
import {
  getAssignedCourses,
  getBookmarkedCourses,
  getRecommendedCourses,
} from "@/lib/mock-courses";

type DashboardPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
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
            All dashboard sample content is sourced from a separate mock file so this page can stay
            free of hardcoded data when you swap in the real database.
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
  const [
    assignedCoursesResult,
    recommendedCoursesResult,
    bookmarkedCoursesResult,
  ] = await Promise.allSettled([
    getAssignedCourses(),
    getRecommendedCourses(),
    getBookmarkedCourses(),
  ]);

  const assignedCourses =
    assignedCoursesResult.status === "fulfilled" ? assignedCoursesResult.value : null;
  const recommendedCourses =
    recommendedCoursesResult.status === "fulfilled" ? recommendedCoursesResult.value : null;
  const bookmarkedCourses =
    bookmarkedCoursesResult.status === "fulfilled" ? bookmarkedCoursesResult.value : null;

  return (
    <DashboardPreview
      query={query}
      assignedCourses={assignedCourses}
      recommendedCourses={recommendedCourses}
      bookmarkedCourses={bookmarkedCourses}
    />
  );
}
