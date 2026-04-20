import { ManagerAssignedCoursesTable } from "@/components/manager/manager-assigned-courses-table";
import { ManagerBookmarksTable } from "@/components/manager/manager-bookmarks-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableEmptyState } from "@/components/ui/table";
import { getManagerDashboardData } from "@/lib/manager/services";

export default async function ManagerPage() {
  const data = await getManagerDashboardData();

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Organization
        </p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            {data.organization?.name ?? "No organization assigned"}
          </h1>
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            {data.organization
              ? `Managed by ${data.organization.ownerName} (${data.organization.ownerEmail}).`
              : "This manager account is not linked to an organization yet."}
          </p>
        </div>
      </header>

      <div className="grid gap-md md:grid-cols-3">
        <SummaryCard
          label="Total employees"
          value={data.summary.totalEmployees}
          description=""
        />
        <SummaryCard
          label="Assigned courses"
          value={data.summary.totalAssignedCourses}
          description=""
        />
        <SummaryCard
          label="Completed courses"
          value={data.summary.totalCompletedCourses}
          description=""
        />
      </div>

      <Card>
        <CardHeader>
          <CardEyebrow>Assigned courses</CardEyebrow>
          <CardTitle>Organization catalog</CardTitle>
          <CardDescription>
            Assigned courses with organization completion progress and removal
            actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.assignedCourses.length > 0 ? (
            <ManagerAssignedCoursesTable courses={data.assignedCourses} />
          ) : (
            <TableEmptyState
              title="No assigned courses"
              description="Assign courses to this organization and they will appear here."
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardEyebrow>Bookmarks</CardEyebrow>
          <CardTitle>Bookmarked courses by employee</CardTitle>
          <CardDescription>
            Bookmark totals are scoped to employees in your organization only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-md">
          {data.bookmarkedCourses.length > 0 ? (
            <ManagerBookmarksTable
              courses={data.bookmarkedCourses}
              organizationName={data.organization?.name ?? "this organization"}
            />
          ) : (
            <TableEmptyState
              title="No course bookmarks yet"
              description="Bookmarked course totals from employees in this organization will appear here."
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
  description: string;
};

function SummaryCard({ label, value, description }: SummaryCardProps) {
  return (
    <Card variant="muted">
      <CardHeader>
        <CardEyebrow>{label}</CardEyebrow>
        <CardTitle className="font-heading text-4xl">{value}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
