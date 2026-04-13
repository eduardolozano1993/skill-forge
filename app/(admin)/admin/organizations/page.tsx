import { AdminOrganizationsTable } from "@/components/admin/admin-tables";
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
import { getAdminOrganizationsTableData } from "@/lib/admin/data";

type AdminOrganizationsPageProps = {
  searchParams?: Promise<{
    organizations?: string | string[];
  }>;
};

function getSingleSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function AdminOrganizationsPage({
  searchParams,
}: AdminOrganizationsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const organizationsSearch = getSingleSearchParam(
    resolvedSearchParams?.organizations,
  );
  const data = await getAdminOrganizationsTableData(organizationsSearch);

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
      )}
    </section>
  );
}
