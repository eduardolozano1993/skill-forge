import { AdminUsersTable } from "@/components/admin/admin-tables";
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
import { getAdminUsersTableData } from "@/lib/admin/data";

type AdminUsersPageProps = {
  searchParams?: Promise<{
    users?: string | string[];
  }>;
};

function getSingleSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const usersSearch = getSingleSearchParam(resolvedSearchParams?.users);
  const data = await getAdminUsersTableData(usersSearch);

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Admin
        </p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            User management
          </h1>
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            Search and review platform users by role, organization, and account details.
          </p>
        </div>
      </header>

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
            query={data.search}
          />
        </CardHeader>
        <CardContent>
          {data.rows.length > 0 ? (
            <AdminUsersTable rows={data.rows} />
          ) : (
            <TableEmptyState
              title="No users found"
              description={
                data.search
                  ? "Try a different users search term."
                  : "Users will appear here once accounts exist."
              }
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
