import { AdminUsersTable } from "@/components/admin/admin-tables";
import { Pagination } from "@/components/ui/pagination";
import { TableUrlSearch } from "@/components/ui/table-url-search";
import { TableEmptyState } from "@/components/ui/table";
import { getAdminUsersTableData } from "@/lib/admin/data";
import { getSingleQueryParam, parsePageQueryParam } from "@/lib/table/utils";

type AdminUsersPageProps = {
  searchParams?: Promise<{
    users?: string | string[];
    page?: string | string[];
  }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const usersSearch = getSingleQueryParam(resolvedSearchParams?.users);
  const currentPage = parsePageQueryParam(resolvedSearchParams?.page);
  const data = await getAdminUsersTableData(usersSearch, currentPage);
  const pagination = data.pagination;

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Users
        </p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            User management
          </h1>
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            Search users by name or email.
          </p>
        </div>
      </header>

      <TableUrlSearch
        label="Search users"
        placeholder="Search users by name or email"
        paramName="users"
        query={data.search}
        resetParams={["page"]}
      />

      {data.rows.length > 0 ? (
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
                of {pagination.totalRows} users
              </p>
              <p>
                {pagination.totalRows === 1
                  ? "1 result"
                  : `${pagination.totalRows} results`}
              </p>
            </div>
          ) : null}

          <AdminUsersTable rows={data.rows} />

          {pagination ? (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pathname="/admin/users"
              searchParams={{
                users: data.search || undefined,
              }}
            />
          ) : null}
        </div>
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
    </section>
  );
}
