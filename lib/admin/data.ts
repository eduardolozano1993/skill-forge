import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import {
  ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
  readThroughJsonCache,
} from "@/lib/redis/cache";
import {
  buildTablePagination,
  DEFAULT_TABLE_PAGE_SIZE,
  matchesSearch,
  normalizeTablePage,
  normalizeTableSearch,
} from "@/lib/table/utils";
import type {
  AdminDashboardData,
  AdminDashboardSearchFilters,
  AdminPlatformSummary,
  AdminSignInLogData,
  AdminUserRow,
} from "@/lib/admin/types";
import type { TableResult } from "@/lib/table/types";
import { AdminTableCourseRow } from "../courses/types";
import { sortByTextAndId } from "../utils/textSort";

const SIGN_IN_LOG_FILE = path.join(
  process.cwd(),
  "logs",
  "sign_in",
  "lockouts.log",
);

async function fetchAdminPlatformSummary(): Promise<AdminPlatformSummary> {
  const [totalUsers, totalCourses, totalOrganizations, totalCompletedCourses] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count({
        where: {
          status: "ACTIVE",
        },
      }),
      prisma.organization.count(),
      prisma.completedCourse.count(),
    ]);

  return {
    totalUsers,
    totalCourses,
    totalOrganizations,
    totalCompletedCourses,
  };
}

async function fetchAdminUsersTableData(
  search?: string | null,
  page?: number | null,
): Promise<TableResult<AdminUserRow>> {
  const normalizedSearch = normalizeTableSearch(search);
  const normalizedPage = normalizeTablePage(page);
  const where: Prisma.UserWhereInput = normalizedSearch
    ? {
        OR: [
          {
            name: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const totalRows = await prisma.user.count({
    where,
  });
  const pagination = buildTablePagination(
    totalRows,
    normalizedPage,
    DEFAULT_TABLE_PAGE_SIZE,
  );
  const skip =
    totalRows === 0 ? 0 : (pagination.page - 1) * pagination.pageSize;

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      displayName: true,
      email: true,
      phone: true,
      userType: true,
      status: true,
      createdAt: true,
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        id: "asc",
      },
    ],
    skip,
    take: pagination.pageSize,
  });

  const rows = users.map<AdminUserRow>((user) => ({
    id: user.id,
    name: user.name,
    displayName: user.displayName,
    email: user.email,
    phone: user.phone,
    userType: user.userType,
    status: user.status,
    organizationId: user.organization?.id ?? null,
    organizationName: user.organization?.name ?? null,
    createdAt: user.createdAt,
  }));

  return {
    search: normalizedSearch,
    rows,
    pagination,
  };
}

async function fetchAdminCoursesTableData(
  search?: string | null,
): Promise<TableResult<AdminTableCourseRow>> {
  const normalizedSearch = normalizeTableSearch(search);
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      name: true,
      summary: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          organizations: true,
          completedByUsers: true,
          bookmarks: true,
        },
      },
    },
  });

  const rows = courses
    .map<AdminTableCourseRow>((course) => ({
      id: course.id,
      name: course.name,
      summary: course.summary,
      status: course.status,
      assignedOrganizationCount: course._count.organizations,
      completedUserCount: course._count.completedByUsers,
      bookmarkCount: course._count.bookmarks,
      createdAt: course.createdAt,
    }))
    .filter((course) =>
      matchesSearch(normalizedSearch, [
        course.id,
        course.name,
        course.summary,
        course.status,
      ]),
    )
    .sort((left, right) => sortByTextAndId(left.name, right.name, left, right));

  return {
    search: normalizedSearch,
    rows,
  };
}

export async function getAdminPlatformSummary() {
  await requireAdmin();
  return readThroughJsonCache(
    ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
    fetchAdminPlatformSummary,
  );
}

export async function getAdminUsersTableData(
  search?: string | null,
  page?: number | null,
) {
  await requireAdmin();
  return fetchAdminUsersTableData(search, page);
}

export async function getAdminCoursesTableData(search?: string | null) {
  await requireAdmin();
  return fetchAdminCoursesTableData(search);
}

export async function getAdminDashboardData(
  filters: AdminDashboardSearchFilters = {},
): Promise<AdminDashboardData> {
  await requireAdmin();

  // const [summary, users, organizations, courses] = await Promise.all([
  //   readThroughJsonCache(
  //     ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
  //     fetchAdminPlatformSummary,
  //   ),
  //   fetchAdminUsersTableData(filters.usersSearch),
  //   // fetchAdminOrganizationsTableData(filters.organizationsSearch),
  //   fetchAdminCoursesTableData(filters.coursesSearch),
  // ]);

  // return {
  //   summary,
  //   users,
  //   organizations,
  //   courses,
  // };
  return {} as AdminDashboardData;
}

export async function getAdminSignInLogData(
  limit = 500,
): Promise<AdminSignInLogData> {
  await requireAdmin();

  try {
    const content = await readFile(SIGN_IN_LOG_FILE, "utf8");
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, Math.max(limit, 0));

    return {
      exists: true,
      lines,
    };
  } catch (error) {
    const isMissingFile =
      error instanceof Error && "code" in error && error.code === "ENOENT";

    if (isMissingFile) {
      return {
        exists: false,
        lines: [],
      };
    }

    throw error;
  }
}
