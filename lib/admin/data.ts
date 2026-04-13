import { readFile } from "node:fs/promises";
import path from "node:path";

import { requireAdmin } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import type {
  AdminCourseRow,
  AdminDashboardData,
  AdminDashboardSearchFilters,
  AdminOrganizationRow,
  AdminPlatformSummary,
  AdminSignInLogData,
  AdminTableResult,
  AdminUserRow,
} from "@/lib/admin/types";

const SIGN_IN_LOG_FILE = path.join(
  process.cwd(),
  "logs",
  "sign_in",
  "lockouts.log",
);

function normalizeSearchQuery(search?: string | null) {
  return search?.trim() ?? "";
}

function matchesSearch(search: string, values: Array<string | number | null>) {
  if (!search) {
    return true;
  }

  const normalizedSearch = search.toLocaleLowerCase();

  return values.some((value) =>
    String(value ?? "")
      .toLocaleLowerCase()
      .includes(normalizedSearch),
  );
}

function sortByTextAndId<T extends { id: number }>(
  leftLabel: string,
  rightLabel: string,
  left: T,
  right: T,
) {
  const nameComparison = leftLabel.localeCompare(rightLabel);

  if (nameComparison !== 0) {
    return nameComparison;
  }

  return left.id - right.id;
}

async function fetchAdminPlatformSummary(): Promise<AdminPlatformSummary> {
  const [
    totalUsers,
    totalCourses,
    totalOrganizations,
    totalCompletedCourses,
  ] = await Promise.all([
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
): Promise<AdminTableResult<AdminUserRow>> {
  const normalizedSearch = normalizeSearchQuery(search);
  const users = await prisma.user.findMany({
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
  });

  const rows = users
    .map<AdminUserRow>((user) => ({
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
    }))
    .filter((user) =>
      matchesSearch(normalizedSearch, [
        user.id,
        user.name,
        user.displayName,
        user.email,
        user.phone,
        user.userType,
        user.status,
        user.organizationName,
      ]),
    )
    .sort((left, right) =>
      sortByTextAndId(left.displayName, right.displayName, left, right),
    );

  return {
    search: normalizedSearch,
    rows,
  };
}

async function fetchAdminOrganizationsTableData(
  search?: string | null,
): Promise<AdminTableResult<AdminOrganizationRow>> {
  const normalizedSearch = normalizeSearchQuery(search);
  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      owner: {
        select: {
          id: true,
          displayName: true,
          email: true,
        },
      },
      _count: {
        select: {
          users: true,
          courses: true,
        },
      },
    },
  });

  const rows = organizations
    .map<AdminOrganizationRow>((organization) => ({
      id: organization.id,
      name: organization.name,
      status: organization.status,
      ownerUserId: organization.owner.id,
      ownerDisplayName: organization.owner.displayName,
      ownerEmail: organization.owner.email,
      memberCount: organization._count.users,
      assignedCourseCount: organization._count.courses,
      createdAt: organization.createdAt,
    }))
    .filter((organization) =>
      matchesSearch(normalizedSearch, [
        organization.id,
        organization.name,
        organization.status,
        organization.ownerUserId,
        organization.ownerDisplayName,
        organization.ownerEmail,
      ]),
    )
    .sort((left, right) => sortByTextAndId(left.name, right.name, left, right));

  return {
    search: normalizedSearch,
    rows,
  };
}

async function fetchAdminCoursesTableData(
  search?: string | null,
): Promise<AdminTableResult<AdminCourseRow>> {
  const normalizedSearch = normalizeSearchQuery(search);
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
    .map<AdminCourseRow>((course) => ({
      id: course.id,
      title: course.name,
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
        course.title,
        course.summary,
        course.status,
      ]),
    )
    .sort((left, right) => sortByTextAndId(left.title, right.title, left, right));

  return {
    search: normalizedSearch,
    rows,
  };
}

export async function getAdminPlatformSummary() {
  await requireAdmin();
  return fetchAdminPlatformSummary();
}

export async function getAdminUsersTableData(search?: string | null) {
  await requireAdmin();
  return fetchAdminUsersTableData(search);
}

export async function getAdminOrganizationsTableData(search?: string | null) {
  await requireAdmin();
  return fetchAdminOrganizationsTableData(search);
}

export async function getAdminCoursesTableData(search?: string | null) {
  await requireAdmin();
  return fetchAdminCoursesTableData(search);
}

export async function getAdminDashboardData(
  filters: AdminDashboardSearchFilters = {},
): Promise<AdminDashboardData> {
  await requireAdmin();

  const [summary, users, organizations, courses] = await Promise.all([
    fetchAdminPlatformSummary(),
    fetchAdminUsersTableData(filters.usersSearch),
    fetchAdminOrganizationsTableData(filters.organizationsSearch),
    fetchAdminCoursesTableData(filters.coursesSearch),
  ]);

  return {
    summary,
    users,
    organizations,
    courses,
  };
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
