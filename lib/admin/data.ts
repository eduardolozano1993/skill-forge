import { readFile } from "node:fs/promises";
import path from "node:path";

import { requireAdmin } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import {
  ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
  readThroughJsonCache,
} from "@/lib/redis/cache";
import { matchesSearch, normalizeTableSearch } from "@/lib/table/utils";
import type {
  AdminPlatformSummary,
  AdminSignInLogData,
} from "@/lib/admin/types";
import type { TableResult } from "@/lib/table/types";
import { AdminTableCourseRow } from "../courses/types";
import { sortByTextAndId } from "../utils/text-sort";

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

export async function getAdminCoursesTableData(search?: string | null) {
  await requireAdmin();
  return fetchAdminCoursesTableData(search);
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
