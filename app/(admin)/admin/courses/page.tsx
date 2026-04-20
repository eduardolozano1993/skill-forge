import { AdminCoursesTable } from "@/components/admin/admin-tables";
import { Pagination } from "@/components/ui/pagination";
import { TableEmptyState } from "@/components/ui/table";
import { TableUrlSearch } from "@/components/ui/table-url-search";
import { getAdminCoursesTableData } from "@/lib/courses/services";
import {
  getSingleQueryParam,
  parsePageQueryParam,
} from "@/lib/utils/table/table";

type AdminCoursesPageProps = {
  searchParams?: Promise<{
    courses?: string | string[];
    page?: string | string[];
  }>;
};

export default async function AdminCoursesPage({
  searchParams,
}: AdminCoursesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const coursesSearch = getSingleQueryParam(resolvedSearchParams?.courses);
  const currentPage = parsePageQueryParam(resolvedSearchParams?.page);
  const { rows, search, pagination } = await getAdminCoursesTableData(
    coursesSearch,
    currentPage,
  );

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Courses
        </p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            Course management
          </h1>
        </div>
      </header>

      <TableUrlSearch
        label="Search courses"
        placeholder="Search courses by name"
        paramName="courses"
        query={search}
        resetParams={["page"]}
      />

      {rows.length > 0 ? (
        <div className="space-y-md">
          {pagination ? (
            <div className="flex flex-col gap-2 text-sm text-text-soft md:flex-row md:items-center md:justify-between">
              <p>
                Showing {(pagination.page - 1) * pagination.pageSize + 1}
                {" - "}
                {Math.min(
                  pagination.page * pagination.pageSize,
                  pagination.totalRows,
                )}{" "}
                of {pagination.totalRows} courses
              </p>
              <p>
                {pagination.totalRows === 1
                  ? "1 result"
                  : `${pagination.totalRows} results`}
              </p>
            </div>
          ) : null}

          <AdminCoursesTable rows={rows} />

          {pagination ? (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pathname="/admin/courses"
              searchParams={{
                courses: search || undefined,
              }}
            />
          ) : null}
        </div>
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
