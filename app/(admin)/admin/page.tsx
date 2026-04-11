import { AdminOrganizationsTable, AdminUsersTable } from "@/components/admin/admin-tables";
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
import { getAdminDashboardData, getAdminSignInLogData } from "@/lib/admin/data";

type AdminPageProps = {
  searchParams?: Promise<{
    users?: string | string[];
    organizations?: string | string[];
  }>;
};

function getSingleSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const usersSearch = getSingleSearchParam(resolvedSearchParams?.users);
  const organizationsSearch = getSingleSearchParam(
    resolvedSearchParams?.organizations,
  );

  const data = await getAdminDashboardData({
    usersSearch,
    organizationsSearch,
  });
  const logData = await getAdminSignInLogData();

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Admin
        </p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            Platform dashboard
          </h1>
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            Platform-wide visibility into users, organizations, and sign-in lockout activity.
          </p>
        </div>
      </header>

      <div className="grid gap-md md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total users" value={data.summary.totalUsers} />
        <SummaryCard label="Total courses" value={data.summary.totalCourses} />
        <SummaryCard
          label="Total orgs"
          value={data.summary.totalOrganizations}
        />
        <SummaryCard
          label="Completed courses"
          value={data.summary.totalCompletedCourses}
        />
      </div>

      <Card>
        <CardHeader className="space-y-sm">
          <CardEyebrow>Users</CardEyebrow>
          <CardTitle>Platform users</CardTitle>
          <CardDescription>
            Search across users, roles, and organization references.
          </CardDescription>
          <AdminUrlSearch
            label="Search users"
            placeholder="Search users by name, email, role, or organization"
            paramName="users"
            query={data.users.search}
          />
        </CardHeader>
        <CardContent>
          {data.users.rows.length > 0 ? (
            <AdminUsersTable rows={data.users.rows} />
          ) : (
            <TableEmptyState
              title="No users found"
              description={
                data.users.search
                  ? "Try a different users search term."
                  : "Users will appear here once accounts exist."
              }
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-sm">
          <CardEyebrow>Organizations</CardEyebrow>
          <CardTitle>Organization directory</CardTitle>
          <CardDescription>
            Inspect organization ownership, membership, and assigned course totals.
          </CardDescription>
          <AdminUrlSearch
            label="Search organizations"
            placeholder="Search organizations by name or owner"
            paramName="organizations"
            query={data.organizations.search}
          />
        </CardHeader>
        <CardContent>
          {data.organizations.rows.length > 0 ? (
            <AdminOrganizationsTable rows={data.organizations.rows} />
          ) : (
            <TableEmptyState
              title="No organizations found"
              description={
                data.organizations.search
                  ? "Try a different organizations search term."
                  : "Organizations will appear here once they are created."
              }
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardEyebrow>Logs</CardEyebrow>
          <CardTitle>Recent sign-in lockouts</CardTitle>
          <CardDescription>
            Last {logData.lines.length} entries from{" "}
            <span className="font-mono text-xs">logs/sign_in/lockouts.log</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logData.lines.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-border bg-surface-muted/60">
              <pre className="max-h-[32rem] overflow-auto p-md text-xs leading-6 text-text-soft">
                {logData.lines.join("\n")}
              </pre>
            </div>
          ) : (
            <TableEmptyState
              title="No sign-in logs available"
              description={
                logData.exists
                  ? "The sign-in lockout log exists but does not contain any entries yet."
                  : "The sign-in lockout log file has not been created yet."
              }
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
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <Card variant="muted">
      <CardHeader>
        <CardEyebrow>{label}</CardEyebrow>
        <CardTitle className="font-heading text-4xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
