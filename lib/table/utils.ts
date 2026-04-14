import type { TablePagination } from "@/lib/table/types";

export const DEFAULT_TABLE_PAGE_SIZE = 10;

export function getSingleQueryParam(value?: string | string[]) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function normalizeTableSearch(search?: string | null) {
  return search?.trim() ?? "";
}

export function parsePageQueryParam(value?: string | string[]) {
  const rawValue = getSingleQueryParam(value);
  const parsedPage = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

export function normalizeTablePage(page?: number | null) {
  if (!page || !Number.isFinite(page)) {
    return 1;
  }

  return Math.max(1, Math.floor(page));
}

export function buildTablePagination(
  totalRows: number,
  requestedPage: number,
  pageSize = DEFAULT_TABLE_PAGE_SIZE,
): TablePagination {
  const totalPages = totalRows === 0 ? 0 : Math.ceil(totalRows / pageSize);
  const page = totalPages === 0 ? 1 : Math.min(requestedPage, totalPages);

  return {
    page,
    pageSize,
    totalRows,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}
