import { prisma } from "@/lib/prisma/prisma";

type CourseDetailActionStateParams = {
  courseId: number;
  userId: number;
  userType: "ADMIN" | "MANAGER" | "EMPLOYEE";
  organizationId: number | null;
};

export type CourseDetailActionState = {
  employeeBookmark: {
    isBookmarked: boolean;
    isAssigned: boolean;
  } | null;
  managerOrganization: {
    name: string;
    isAssigned: boolean;
  } | null;
};

export async function getCourseDetailActionState({
  courseId,
  userId,
  userType,
  organizationId,
}: CourseDetailActionStateParams): Promise<CourseDetailActionState> {
  if (userType === "EMPLOYEE") {
    const [employeeBookmark, employeeAssignment] = await Promise.all([
      prisma.bookmark.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        select: {
          courseId: true,
        },
      }),
      organizationId
        ? prisma.organizationCourse.findUnique({
            where: {
              organizationId_courseId: {
                organizationId,
                courseId,
              },
            },
            select: {
              courseId: true,
            },
          })
        : Promise.resolve(null),
    ]);

    return {
      employeeBookmark: {
        isBookmarked: Boolean(employeeBookmark),
        isAssigned: Boolean(employeeAssignment),
      },
      managerOrganization: null,
    };
  }

  if (userType === "MANAGER" && organizationId) {
    const managerOrganization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      select: {
        name: true,
        courses: {
          where: {
            courseId,
          },
          select: {
            courseId: true,
          },
        },
      },
    });

    return {
      employeeBookmark: null,
      managerOrganization: managerOrganization
        ? {
            name: managerOrganization.name,
            isAssigned: managerOrganization.courses.some(
              (assignedCourse) => assignedCourse.courseId === courseId,
            ),
          }
        : null,
    };
  }

  return {
    employeeBookmark: null,
    managerOrganization: null,
  };
}
