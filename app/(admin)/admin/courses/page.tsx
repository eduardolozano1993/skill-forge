import { AdminCoursesTable } from "@/components/admin/admin-tables";
import { AdminUrlSearch } from "@/components/admin/admin-url-search";
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableEmptyState } from "@/components/ui/table";
import { getAdminCoursesTableData } from "@/lib/admin/data";

type AdminCoursesPageProps = {
  searchParams?: Promise<{
    courses?: string | string[];
  }>;
};

function getSingleSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AdminCoursesPage({
  searchParams,
}: AdminCoursesPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const coursesSearch = getSingleSearchParam(resolvedSearchParams?.courses);
  const data = await getAdminCoursesTableData(coursesSearch);

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
            Search and review courses by catalog details, assignment totals, and
            engagement signals.
          </p>
        </div>
      </header>

      <Card>
        <CardHeader className="space-y-sm">
          <CardEyebrow>Courses</CardEyebrow>
          <CardTitle>Course directory</CardTitle>
          <CardDescription>
            Search across course names and summaries.
          </CardDescription>
          <AdminUrlSearch
            label="Search courses"
            placeholder="Search courses by name or summary"
            paramName="courses"
            query={data.search}
          />
        </CardHeader>
        <CardContent>
          {data.rows.length > 0 ? (
            <AdminCoursesTable rows={data.rows} />
          ) : (
            <TableEmptyState
              title="No courses found"
              description={
                data.search
                  ? "Try a different courses search term."
                  : "Courses will appear here once they are created."
              }
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
