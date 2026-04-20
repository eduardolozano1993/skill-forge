"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/auth";
import {
  getAdminCoursesTableData,
  getAdminPlatformSummary,
  getAdminSignInLogData,
} from "@/lib/admin/data";
import { prisma } from "@/lib/utils/prisma/prisma";
import {
  ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
  deleteCacheKeys,
  deleteCacheKeysByPattern,
  getManagerDashboardCacheKey,
} from "@/lib/utils/redis/cache";

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

const updateOrganizationStatusSchema = z.object({
  organizationId: z.number().int().positive(),
  status: z.enum(["ACTIVE", "DEACTIVATED"]),
});

const updateCourseStatusSchema = z.object({
  courseId: z.number().int().positive(),
  status: z.enum(["ACTIVE", "DEACTIVATED"]),
});

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
      organizationId: true,
    },
  });

  if (!user) {
    return {
      error: "User not found.",
    };
  }

  if (user.userType === "ADMIN") {
    return {
      error:
        "Admin accounts cannot be deactivated or activated from this table.",
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

  await deleteCacheKeys([
    ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
    user.organizationId
      ? getManagerDashboardCacheKey(user.organizationId)
      : null,
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/users");

  return {
    success: true,
    status: updatedUser.status,
    changed: true,
  };
}

export async function updateAdminOrganizationStatusAction(
  organizationId: number,
  status: "ACTIVE" | "DEACTIVATED",
) {
  const parsedPayload = updateOrganizationStatusSchema.safeParse({
    organizationId,
    status,
  });

  if (!parsedPayload.success) {
    return {
      error: "Invalid organization status update.",
    };
  }

  await requireAdmin();

  const organization = await prisma.organization.findUnique({
    where: {
      id: parsedPayload.data.organizationId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!organization) {
    return {
      error: "Organization not found.",
    };
  }

  if (organization.status === parsedPayload.data.status) {
    return {
      success: true,
      status: organization.status,
      changed: false,
      affectedUsers: 0,
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedOrganization = await tx.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        status: parsedPayload.data.status,
      },
      select: {
        status: true,
      },
    });

    const updatedUsers = await tx.user.updateMany({
      where: {
        organizationId: organization.id,
        userType: {
          not: "ADMIN",
        },
      },
      data: {
        status: parsedPayload.data.status,
      },
    });

    return {
      status: updatedOrganization.status,
      affectedUsers: updatedUsers.count,
    };
  });

  await deleteCacheKeys([
    ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
    getManagerDashboardCacheKey(organization.id),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/organizations");
  revalidatePath("/admin/users");

  return {
    success: true,
    status: result.status,
    changed: true,
    affectedUsers: result.affectedUsers,
  };
}

export async function updateAdminCourseStatusAction(
  courseId: number,
  status: "ACTIVE" | "DEACTIVATED",
) {
  const parsedPayload = updateCourseStatusSchema.safeParse({
    courseId,
    status,
  });

  if (!parsedPayload.success) {
    return {
      error: "Invalid course status update.",
    };
  }

  await requireAdmin();

  const course = await prisma.course.findUnique({
    where: {
      id: parsedPayload.data.courseId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!course) {
    return {
      error: "Course not found.",
    };
  }

  if (course.status === parsedPayload.data.status) {
    return {
      success: true,
      status: course.status,
      changed: false,
    };
  }

  const updatedCourse = await prisma.course.update({
    where: {
      id: course.id,
    },
    data: {
      status: parsedPayload.data.status,
    },
    select: {
      status: true,
    },
  });

  await Promise.all([
    deleteCacheKeys([ADMIN_PLATFORM_SUMMARY_CACHE_KEY]),
    deleteCacheKeysByPattern([`cache:course:${course.id}:detail:*`]),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath(`/courses/${course.id}`);
  revalidatePath(`/admin/courses/${course.id}/edit`);

  return {
    success: true,
    status: updatedCourse.status,
    changed: true,
  };
}
