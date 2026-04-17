// import { AdminOrganizationsTable } from "@/components/admin/admin-tables";
// import { TableEmptyState } from "@/components/ui/table";
// import { TableUrlSearch } from "@/components/ui/table-url-search";
// import { getAdminOrganizationsTableData } from "@/lib/admin/data";
// import { getSingleQueryParam } from "@/lib/table/utils";

type AdminOrganizationsPageProps = {
  searchParams?: Promise<{
    organizations?: string | string[];
  }>;
};

export default async function AdminOrganizationsPage(
  {
    // searchParams,
  }: AdminOrganizationsPageProps,
) {
  // const resolvedSearchParams = searchParams ? await searchParams : undefined;
  // const organizationsSearch = getSingleQueryParam(
  //   resolvedSearchParams?.organizations,
  // );
  // const data = await getAdminOrganizationsTableData(organizationsSearch);

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Organizations
        </p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            Organization management
          </h1>
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            Search across organization names and owner references.
          </p>
        </div>
      </header>
      {/* 
      <TableUrlSearch
        label="Search organizations"
        placeholder="Search organizations by name or owner references"
        paramName="organizations"
        query={data.search}
      />

      {data.rows.length > 0 ? (
        <AdminOrganizationsTable rows={data.rows} />
      ) : (
        <TableEmptyState
          title="No organizations found"
          description={
            data.search
              ? "Try a different organizations search term."
              : "Organizations will appear here once they are created."
          }
        />
      )} */}
    </section>
  );
}
