"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireManager } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

const assignBookmarkedCourseSchema = z.object({
  courseId: z.number().int().positive(),
});

export async function assignCourseToOrganizationAction(courseId: number) {
  const parsedPayload = assignBookmarkedCourseSchema.safeParse({ courseId });

  if (!parsedPayload.success) {
    return {
      error: "Invalid course selection.",
    };
  }

  const session = await requireManager();
  const organizationId = session.user.organizationId;

  if (!organizationId) {
    return {
      error: "This manager account is not linked to an organization.",
    };
  }

  const [course, existingAssignment] = await Promise.all([
    prisma.course.findUnique({
      where: {
        id: parsedPayload.data.courseId,
      },
      select: {
        id: true,
      },
    }),
    prisma.organizationCourse.findUnique({
      where: {
        organizationId_courseId: {
          organizationId,
          courseId: parsedPayload.data.courseId,
        },
      },
      select: {
        courseId: true,
      },
    }),
  ]);

  if (!course) {
    return {
      error: "Course not found.",
    };
  }

  if (existingAssignment) {
    return {
      success: true,
      assigned: false,
      alreadyAssigned: true,
    };
  }

  await prisma.organizationCourse.create({
    data: {
      organizationId,
      courseId: parsedPayload.data.courseId,
    },
  });

  revalidatePath("/manager");
  revalidatePath("/courses");
  revalidatePath("/dashboard");

  return {
    success: true,
    assigned: true,
    alreadyAssigned: false,
  };
}

export async function assignBookmarkedCourseToOrganizationAction(
  courseId: number,
) {
  const parsedPayload = assignBookmarkedCourseSchema.safeParse({ courseId });

  if (!parsedPayload.success) {
    return {
      error: "Invalid course selection.",
    };
  }

  const session = await requireManager();
  const organizationId = session.user.organizationId;

  if (!organizationId) {
    return {
      error: "This manager account is not linked to an organization.",
    };
  }

  const [course, employeeIds, existingAssignment] = await Promise.all([
    prisma.course.findUnique({
      where: {
        id: parsedPayload.data.courseId,
      },
      select: {
        id: true,
      },
    }),
    prisma.user.findMany({
      where: {
        organizationId,
        userType: "EMPLOYEE",
      },
      select: {
        id: true,
      },
    }),
    prisma.organizationCourse.findUnique({
      where: {
        organizationId_courseId: {
          organizationId,
          courseId: parsedPayload.data.courseId,
        },
      },
      select: {
        courseId: true,
      },
    }),
  ]);

  if (!course) {
    return {
      error: "Course not found.",
    };
  }

  await prisma.$transaction(async (tx) => {
    if (employeeIds.length > 0) {
      await tx.bookmark.deleteMany({
        where: {
          courseId: parsedPayload.data.courseId,
          userId: {
            in: employeeIds.map((employee) => employee.id),
          },
        },
      });
    }

    if (!existingAssignment) {
      await tx.organizationCourse.create({
        data: {
          organizationId,
          courseId: parsedPayload.data.courseId,
        },
      });
    }
  });

  revalidatePath("/manager");
  revalidatePath("/courses");
  revalidatePath("/dashboard");

  return {
    success: true,
    assigned: !existingAssignment,
  };
}

const removeAssignedCourseSchema = z.object({
  courseId: z.number().int().positive(),
});

export async function removeAssignedCourseFromOrganizationAction(
  courseId: number,
) {
  const parsedPayload = removeAssignedCourseSchema.safeParse({ courseId });

  if (!parsedPayload.success) {
    return {
      error: "Invalid course selection.",
    };
  }

  const session = await requireManager();
  const organizationId = session.user.organizationId;

  if (!organizationId) {
    return {
      error: "This manager account is not linked to an organization.",
    };
  }

  const existingAssignment = await prisma.organizationCourse.findUnique({
    where: {
      organizationId_courseId: {
        organizationId,
        courseId: parsedPayload.data.courseId,
      },
    },
    select: {
      courseId: true,
    },
  });

  if (!existingAssignment) {
    return {
      error: "Course is not currently assigned to this organization.",
    };
  }

  await prisma.organizationCourse.delete({
    where: {
      organizationId_courseId: {
        organizationId,
        courseId: parsedPayload.data.courseId,
      },
    },
  });

  revalidatePath("/manager");
  revalidatePath("/courses");
  revalidatePath("/dashboard");

  return {
    success: true,
  };
}
