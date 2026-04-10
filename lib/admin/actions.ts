"use server";

import { z } from "zod";

import {
  getAdminCoursesTableData,
  getAdminDashboardData,
  getAdminOrganizationsTableData,
  getAdminPlatformSummary,
  getAdminSignInLogData,
  getAdminUsersTableData,
} from "@/lib/admin/data";
import type { AdminDashboardSearchFilters } from "@/lib/admin/types";

const adminSearchFiltersSchema = z.object({
  usersSearch: z.string().optional().nullable(),
  organizationsSearch: z.string().optional().nullable(),
  coursesSearch: z.string().optional().nullable(),
});

const adminTableSearchSchema = z.object({
  search: z.string().optional().nullable(),
});

const adminLogLimitSchema = z.object({
  limit: z.number().int().min(0).max(500).default(500),
});

function parseSearchFilters(
  filters: AdminDashboardSearchFilters = {},
): AdminDashboardSearchFilters {
  const parsedFilters = adminSearchFiltersSchema.safeParse(filters);

  if (!parsedFilters.success) {
    return {};
  }

  return parsedFilters.data;
}

function parseTableSearch(search?: string | null) {
  const parsedSearch = adminTableSearchSchema.safeParse({ search });

  if (!parsedSearch.success) {
    return "";
  }

  return parsedSearch.data.search ?? "";
}

export async function getAdminPlatformSummaryAction() {
  return getAdminPlatformSummary();
}

export async function getAdminDashboardDataAction(
  filters: AdminDashboardSearchFilters = {},
) {
  return getAdminDashboardData(parseSearchFilters(filters));
}

export async function getAdminUsersTableDataAction(search?: string | null) {
  return getAdminUsersTableData(parseTableSearch(search));
}

export async function getAdminOrganizationsTableDataAction(
  search?: string | null,
) {
  return getAdminOrganizationsTableData(parseTableSearch(search));
}

export async function getAdminCoursesTableDataAction(search?: string | null) {
  return getAdminCoursesTableData(parseTableSearch(search));
}

export async function getAdminSignInLogDataAction(limit?: number) {
  const parsedLimit = adminLogLimitSchema.safeParse({ limit });

  return getAdminSignInLogData(parsedLimit.success ? parsedLimit.data.limit : 500);
}
