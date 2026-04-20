import { prisma } from "@/lib/prisma/prisma";

export type ManagerCourseSelection = {
  organizationId: number;
  courseId: number;
};

export async function courseIsActive(courseId: number) {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      status: true,
    },
  });

  return course?.status === "ACTIVE";
}

export async function createOrganizationCourseAssignment({
  organizationId,
  courseId,
}: ManagerCourseSelection) {
  const result = await prisma.organizationCourse.createMany({
    data: [
      {
        organizationId,
        courseId,
      },
    ],
    skipDuplicates: true,
  });

  return {
    assigned: result.count > 0,
  };
}

export async function assignBookmarkedCourseToOrganization({
  organizationId,
  courseId,
}: ManagerCourseSelection) {
  return prisma.$transaction(async (tx) => {
    const employeeIds = await tx.user.findMany({
      where: {
        organizationId,
        userType: "EMPLOYEE",
      },
      select: {
        id: true,
      },
    });

    if (employeeIds.length > 0) {
      await tx.bookmark.deleteMany({
        where: {
          courseId,
          userId: {
            in: employeeIds.map((employee) => employee.id),
          },
        },
      });
    }

    const assignment = await tx.organizationCourse.createMany({
      data: [
        {
          organizationId,
          courseId,
        },
      ],
      skipDuplicates: true,
    });

    return {
      assigned: assignment.count > 0,
    };
  });
}

export async function deleteOrganizationCourseAssignment({
  organizationId,
  courseId,
}: ManagerCourseSelection) {
  const result = await prisma.organizationCourse.deleteMany({
    where: {
      organizationId,
      courseId,
    },
  });

  return {
    removed: result.count > 0,
  };
}
