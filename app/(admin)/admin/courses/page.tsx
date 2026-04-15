import { AdminCoursesTable } from "@/components/admin/admin-tables";
import { TableEmptyState } from "@/components/ui/table";
import { TableUrlSearch } from "@/components/ui/table-url-search";
import { getAdminCoursesTableData } from "@/lib/courses/temp/services";

import { getSingleQueryParam } from "@/lib/table/utils";

type AdminCoursesPageProps = {
  searchParams?: Promise<{
    courses?: string | string[];
  }>;
};

export default async function AdminCoursesPage({
  searchParams,
}: AdminCoursesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const coursesSearch = getSingleQueryParam(resolvedSearchParams?.courses);
  const { courses, search } = await getAdminCoursesTableData(coursesSearch);

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Admin
        </p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            Course management
          </h1>
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            Search across course names and summaries.
          </p>
        </div>
      </header>

      <TableUrlSearch
        label="Search courses"
        placeholder="Search courses by title, summary, or status"
        paramName="courses"
        query={search}
      />

      {courses.length > 0 ? (
        <AdminCoursesTable rows={courses} />
      ) : (
        <TableEmptyState
          title="No courses found"
          description={
            search
              ? "Try a different courses search term."
              : "Courses will appear here once they are created."
          }
        />
      )}
    </section>
  );
}
