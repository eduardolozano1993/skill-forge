import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableEmptyState } from "@/components/ui/table";
import {
  getAdminPlatformSummary,
  getAdminSignInLogData,
} from "@/lib/admin/data";

export default async function AdminPage() {
  const [summary, logData] = await Promise.all([
    getAdminPlatformSummary(),
    getAdminSignInLogData(),
  ]);

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
        <SummaryCard label="Total users" value={summary.totalUsers} />
        <SummaryCard label="Total courses" value={summary.totalCourses} />
        <SummaryCard label="Total orgs" value={summary.totalOrganizations} />
        <SummaryCard
          label="Completed courses"
          value={summary.totalCompletedCourses}
        />
      </div>

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
