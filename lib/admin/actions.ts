"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/auth";
import {
  getAdminCoursesTableData,
  getAdminDashboardData,
  getAdminOrganizationsTableData,
  getAdminPlatformSummary,
  getAdminSignInLogData,
  getAdminUsersTableData,
} from "@/lib/admin/data";
import type { AdminDashboardSearchFilters } from "@/lib/admin/types";
import { prisma } from "@/lib/prisma/prisma";

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

const updateUserStatusSchema = z.object({
  userId: z.number().int().positive(),
  status: z.enum(["ACTIVE", "DEACTIVATED"]),
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

export async function updateAdminUserStatusAction(
  userId: number,
  status: "ACTIVE" | "DEACTIVATED",
) {
  const parsedPayload = updateUserStatusSchema.safeParse({ userId, status });

  if (!parsedPayload.success) {
    return {
      error: "Invalid user status update.",
    };
  }

  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: {
      id: parsedPayload.data.userId,
    },
    select: {
      id: true,
      userType: true,
      status: true,
    },
  });

  if (!user) {
    return {
      error: "User not found.",
    };
  }

  if (user.userType === "ADMIN") {
    return {
      error: "Admin accounts cannot be deactivated or activated from this table.",
    };
  }

  if (user.status === parsedPayload.data.status) {
    return {
      success: true,
      status: user.status,
      changed: false,
    };
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      status: parsedPayload.data.status,
    },
    select: {
      status: true,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");

  return {
    success: true,
    status: updatedUser.status,
    changed: true,
  };
}
