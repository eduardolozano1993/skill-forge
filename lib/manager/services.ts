import { requireManager } from "@/lib/auth/auth";
import { deleteCacheKeys, getManagerDashboardCacheKey } from "@/lib/redis/cache";

import {
  assignBookmarkedCourseToOrganization,
  courseIsActive,
  createOrganizationCourseAssignment,
  deleteOrganizationCourseAssignment,
} from "./queries";
export { getManagerDashboardData } from "./queries";

type ManagerCourseActionError = {
  success: false;
  error: string;
};

type AssignCourseToOrganizationResult =
  | ManagerCourseActionError
  | {
      success: true;
      error?: undefined;
      assigned: boolean;
      alreadyAssigned: boolean;
    };

type AssignBookmarkedCourseToOrganizationResult =
  | ManagerCourseActionError
  | {
      success: true;
      error?: undefined;
      assigned: boolean;
    };

type RemoveAssignedCourseFromOrganizationResult =
  | ManagerCourseActionError
  | {
      success: true;
      error?: undefined;
    };

async function getRequiredManagerOrganizationId() {
  const session = await requireManager();
  return session.user.organizationId;
}

async function invalidateManagerOrganizationCaches(organizationId: number) {
  await deleteCacheKeys([getManagerDashboardCacheKey(organizationId)]);
}

export async function assignCourseToOrganization(
  courseId: number,
): Promise<AssignCourseToOrganizationResult> {
  const organizationId = await getRequiredManagerOrganizationId();

  if (!organizationId) {
    return {
      success: false,
      error: "This manager account is not linked to an organization.",
    };
  }

  if (!(await courseIsActive(courseId))) {
    return {
      success: false,
      error: "Course not found.",
    };
  }

  const result = await createOrganizationCourseAssignment({
    organizationId,
    courseId,
  });

  if (result.assigned) {
    await invalidateManagerOrganizationCaches(organizationId);
  }

  return {
    success: true,
    assigned: result.assigned,
    alreadyAssigned: !result.assigned,
  };
}

export async function assignBookmarkedCourse(
  courseId: number,
): Promise<AssignBookmarkedCourseToOrganizationResult> {
  const organizationId = await getRequiredManagerOrganizationId();

  if (!organizationId) {
    return {
      success: false,
      error: "This manager account is not linked to an organization.",
    };
  }

  if (!(await courseIsActive(courseId))) {
    return {
      success: false,
      error: "Course not found.",
    };
  }

  const result = await assignBookmarkedCourseToOrganization({
    organizationId,
    courseId,
  });
  await invalidateManagerOrganizationCaches(organizationId);

  return {
    success: true,
    assigned: result.assigned,
  };
}

export async function removeAssignedCourseFromOrganization(
  courseId: number,
): Promise<RemoveAssignedCourseFromOrganizationResult> {
  const organizationId = await getRequiredManagerOrganizationId();

  if (!organizationId) {
    return {
      success: false,
      error: "This manager account is not linked to an organization.",
    };
  }

  const result = await deleteOrganizationCourseAssignment({
    organizationId,
    courseId,
  });

  if (!result.removed) {
    return {
      success: false,
      error: "Course is not currently assigned to this organization.",
    };
  }

  await invalidateManagerOrganizationCaches(organizationId);

  return {
    success: true,
  };
}
