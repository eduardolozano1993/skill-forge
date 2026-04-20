"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminCoursesTableData,
  getAdminPlatformSummary,
  getAdminSignInLogData,
  updateAdminCourseStatus,
  updateAdminOrganizationStatus,
  updateAdminUserStatus,
} from "@/lib/admin/services";
import {
  adminLogLimitSchema,
  adminTableSearchSchema,
  updateAdminCourseStatusSchema,
  updateAdminOrganizationStatusSchema,
  updateAdminUserStatusSchema,
} from "@/lib/admin/schemas";

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

export async function getAdminCoursesTableDataAction(search?: string | null) {
  return getAdminCoursesTableData(parseTableSearch(search));
}

export async function getAdminSignInLogDataAction(limit?: number) {
  const parsedLimit = adminLogLimitSchema.safeParse({ limit });

  return getAdminSignInLogData(
    parsedLimit.success ? parsedLimit.data.limit : 500,
  );
}

export async function updateAdminUserStatusAction(
  userId: number,
  status: "ACTIVE" | "DEACTIVATED",
) {
  const parsedPayload = updateAdminUserStatusSchema.safeParse({ userId, status });

  if (!parsedPayload.success) {
    return {
      success: false,
      error: "Invalid user status update.",
    };
  }

  const result = await updateAdminUserStatus(
    parsedPayload.data.userId,
    parsedPayload.data.status,
  );

  if (result.success) {
    revalidatePath("/admin");
    revalidatePath("/admin/users");
  }

  return result;
}

export async function updateAdminOrganizationStatusAction(
  organizationId: number,
  status: "ACTIVE" | "DEACTIVATED",
) {
  const parsedPayload = updateAdminOrganizationStatusSchema.safeParse({
    organizationId,
    status,
  });

  if (!parsedPayload.success) {
    return {
      success: false,
      error: "Invalid organization status update.",
    };
  }

  const result = await updateAdminOrganizationStatus(
    parsedPayload.data.organizationId,
    parsedPayload.data.status,
  );

  if (result.success) {
    revalidatePath("/admin");
    revalidatePath("/admin/organizations");
    revalidatePath("/admin/users");
  }

  return result;
}

export async function updateAdminCourseStatusAction(
  courseId: number,
  status: "ACTIVE" | "DEACTIVATED",
) {
  const parsedPayload = updateAdminCourseStatusSchema.safeParse({
    courseId,
    status,
  });

  if (!parsedPayload.success) {
    return {
      success: false,
      error: "Invalid course status update.",
    };
  }

  const result = await updateAdminCourseStatus(
    parsedPayload.data.courseId,
    parsedPayload.data.status,
  );

  if (result.success) {
    revalidatePath("/admin");
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    revalidatePath(`/courses/${parsedPayload.data.courseId}`);
    revalidatePath(`/admin/courses/${parsedPayload.data.courseId}/edit`);
  }

  return result;
}
