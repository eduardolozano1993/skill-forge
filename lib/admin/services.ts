import { requireAdmin } from "@/lib/auth/auth";
import {
  ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
  deleteCacheKeys,
  deleteCacheKeysByPattern,
  getManagerDashboardCacheKey,
  readThroughJsonCache,
} from "@/lib/utils/redis/cache";

import type {
  AdminCourseStatus,
  AdminOrganizationStatus,
  AdminUserStatus,
} from "./schemas";
import {
  fetchAdminCoursesTableData,
  fetchAdminPlatformSummary,
  fetchAdminSignInLogData,
  findCourseStatusRecord,
  findOrganizationStatusRecord,
  findUserStatusRecord,
  updateCourseStatus,
  updateOrganizationStatusWithUsers,
  updateUserStatus,
} from "./queries";
export type {
  AdminDashboardData,
  AdminDashboardSearchFilters,
  AdminOrganizationRow,
  AdminPlatformSummary,
  AdminSignInLogData,
} from "./queries";

type AdminActionError = {
  success: false;
  error: string;
};

type UpdateAdminUserStatusResult =
  | AdminActionError
  | {
      success: true;
      status: AdminUserStatus;
      changed: boolean;
    };

type UpdateAdminOrganizationStatusResult =
  | AdminActionError
  | {
      success: true;
      status: AdminOrganizationStatus;
      changed: boolean;
      affectedUsers: number;
    };

type UpdateAdminCourseStatusResult =
  | AdminActionError
  | {
      success: true;
      status: AdminCourseStatus;
      changed: boolean;
    };

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

export async function getAdminSignInLogData(limit = 500) {
  await requireAdmin();
  return fetchAdminSignInLogData(limit);
}

export async function updateAdminUserStatus(
  userId: number,
  status: AdminUserStatus,
): Promise<UpdateAdminUserStatusResult> {
  await requireAdmin();

  const user = await findUserStatusRecord(userId);

  if (!user) {
    return {
      success: false,
      error: "User not found.",
    };
  }

  if (user.userType === "ADMIN") {
    return {
      success: false,
      error: "Admin accounts cannot be deactivated or activated from this table.",
    };
  }

  if (user.status === status) {
    return {
      success: true,
      status: user.status,
      changed: false,
    };
  }

  const updatedUser = await updateUserStatus(user.id, status);

  await deleteCacheKeys([
    ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
    user.organizationId ? getManagerDashboardCacheKey(user.organizationId) : null,
  ]);

  return {
    success: true,
    status: updatedUser.status,
    changed: true,
  };
}

export async function updateAdminOrganizationStatus(
  organizationId: number,
  status: AdminOrganizationStatus,
): Promise<UpdateAdminOrganizationStatusResult> {
  await requireAdmin();

  const organization = await findOrganizationStatusRecord(organizationId);

  if (!organization) {
    return {
      success: false,
      error: "Organization not found.",
    };
  }

  if (organization.status === status) {
    return {
      success: true,
      status: organization.status,
      changed: false,
      affectedUsers: 0,
    };
  }

  const result = await updateOrganizationStatusWithUsers(organization.id, status);

  await deleteCacheKeys([
    ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
    getManagerDashboardCacheKey(organization.id),
  ]);

  return {
    success: true,
    status: result.status,
    changed: true,
    affectedUsers: result.affectedUsers,
  };
}

export async function updateAdminCourseStatus(
  courseId: number,
  status: AdminCourseStatus,
): Promise<UpdateAdminCourseStatusResult> {
  await requireAdmin();

  const course = await findCourseStatusRecord(courseId);

  if (!course) {
    return {
      success: false,
      error: "Course not found.",
    };
  }

  if (course.status === status) {
    return {
      success: true,
      status: course.status,
      changed: false,
    };
  }

  const updatedCourse = await updateCourseStatus(course.id, status);

  await Promise.all([
    deleteCacheKeys([ADMIN_PLATFORM_SUMMARY_CACHE_KEY]),
    deleteCacheKeysByPattern([`cache:course:${course.id}:detail:*`]),
  ]);

  return {
    success: true,
    status: updatedCourse.status,
    changed: true,
  };
}
