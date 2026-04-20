import { requireAdmin } from "@/lib/auth/auth";
import {
  normalizeTablePage,
  normalizeTableSearch,
  TableResult,
} from "@/lib/utils/table/table";
import type { UsersTableRow } from "./types";
import { queryUsers } from "./queries";

export async function getUsers(
  search?: string | null,
  page?: number | null,
): Promise<TableResult<UsersTableRow>> {
  await requireAdmin();

  const normalizedSearch = normalizeTableSearch(search);
  const normalizedPage = normalizeTablePage(page);

  return await queryUsers(normalizedSearch, normalizedPage);
}
