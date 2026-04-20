import { readFile } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/lib/utils/prisma/prisma";
import {
  matchesSearch,
  normalizeTableSearch,
  TableResult,
} from "@/lib/utils/table/table";

import { AdminTableCourseRow } from "../courses/types";
import type { UsersTableRow } from "../users/types";
import { sortByTextAndId } from "../utils/helpers/text-sort";
import type {
  AdminCourseStatus,
  AdminOrganizationStatus,
  AdminUserStatus,
} from "./schemas";

const SIGN_IN_LOG_FILE = path.join(
  process.cwd(),
  "logs",
  "sign_in",
  "lockouts.log",
);

export type AdminPlatformSummary = {
  totalUsers: number;
  totalCourses: number;
  totalOrganizations: number;
  totalCompletedCourses: number;
};

export type AdminOrganizationRow = {
  id: number;
  name: string;
  status: AdminOrganizationStatus;
  ownerUserId: number;
  ownerDisplayName: string;
  ownerEmail: string;
  memberCount: number;
  assignedCourseCount: number;
  createdAt: Date;
};

export type AdminDashboardSearchFilters = {
  usersSearch?: string | null;
  organizationsSearch?: string | null;
  coursesSearch?: string | null;
};

export type AdminSignInLogData = {
  exists: boolean;
  lines: string[];
};

export type AdminDashboardData = {
  summary: AdminPlatformSummary;
  users: TableResult<UsersTableRow>;
  organizations: TableResult<AdminOrganizationRow>;
  courses: TableResult<AdminTableCourseRow>;
};

export async function fetchAdminPlatformSummary(): Promise<AdminPlatformSummary> {
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

export async function fetchAdminCoursesTableData(
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

export async function fetchAdminSignInLogData(
  limit: number,
): Promise<AdminSignInLogData> {
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

export async function findUserStatusRecord(userId: number) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      userType: true,
      status: true,
      organizationId: true,
    },
  });
}

export async function updateUserStatus(
  userId: number,
  status: AdminUserStatus,
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    select: {
      status: true,
    },
  });
}

export async function findOrganizationStatusRecord(organizationId: number) {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    select: {
      id: true,
      status: true,
    },
  });
}

export async function updateOrganizationStatusWithUsers(
  organizationId: number,
  status: AdminOrganizationStatus,
) {
  return prisma.$transaction(async (tx) => {
    const updatedOrganization = await tx.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        status,
      },
      select: {
        status: true,
      },
    });

    const updatedUsers = await tx.user.updateMany({
      where: {
        organizationId,
        userType: {
          not: "ADMIN",
        },
      },
      data: {
        status,
      },
    });

    return {
      status: updatedOrganization.status,
      affectedUsers: updatedUsers.count,
    };
  });
}

export async function findCourseStatusRecord(courseId: number) {
  return prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      status: true,
    },
  });
}

export async function updateCourseStatus(
  courseId: number,
  status: AdminCourseStatus,
) {
  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      status,
    },
    select: {
      status: true,
    },
  });
}
