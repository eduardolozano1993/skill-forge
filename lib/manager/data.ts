import { prisma } from "@/lib/prisma/prisma";
import { requireManager } from "@/lib/auth/auth";

export type ManagerOrganizationSummary = {
  totalEmployees: number;
  totalAssignedCourses: number;
  totalCompletedCourses: number;
};

export type ManagerAssignedCourseSummary = {
  courseId: number;
  courseTitle: string;
  completedEmployees: number;
  totalEmployees: number;
  completionRate: number;
};

export type ManagerBookmarkedCourseSummary = {
  courseId: number;
  courseTitle: string;
  employeeCount: number;
  isAssigned: boolean;
};

export type ManagerDashboardData = {
  organization: {
    id: number;
    name: string;
    ownerName: string;
    ownerEmail: string;
  } | null;
  summary: ManagerOrganizationSummary;
  assignedCourses: ManagerAssignedCourseSummary[];
  bookmarkedCourses: ManagerBookmarkedCourseSummary[];
};

export async function getManagerDashboardData(): Promise<ManagerDashboardData> {
  const session = await requireManager();
  const organizationId = session.user.organizationId;

  if (!organizationId) {
    return {
      organization: null,
      summary: {
        totalEmployees: 0,
        totalAssignedCourses: 0,
        totalCompletedCourses: 0,
      },
      assignedCourses: [],
      bookmarkedCourses: [],
    };
  }

  const [organization, totalEmployees, totalAssignedCourses, totalCompletedCourses, assignedCourses, bookmarkedCoursesByEmployee] =
    await Promise.all([
      prisma.organization.findUnique({
        where: {
          id: organizationId,
        },
        select: {
          id: true,
          name: true,
          owner: {
            select: {
              displayName: true,
              email: true,
            },
          },
        },
      }),
      prisma.user.count({
        where: {
          organizationId,
          userType: "EMPLOYEE",
        },
      }),
      prisma.organizationCourse.count({
        where: {
          organizationId,
        },
      }),
      prisma.completedCourse.count({
        where: {
          user: {
            organizationId,
            userType: "EMPLOYEE",
          },
        },
      }),
      prisma.organizationCourse.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          course: {
            name: "asc",
          },
        },
        select: {
          course: {
            select: {
              id: true,
              name: true,
              completedByUsers: {
                where: {
                  user: {
                    organizationId,
                    userType: "EMPLOYEE",
                  },
                },
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      }),
      prisma.bookmark.findMany({
        where: {
          user: {
            organizationId,
            userType: "EMPLOYEE",
          },
        },
        orderBy: [
          {
            user: {
              displayName: "asc",
            },
          },
          {
            course: {
              name: "asc",
            },
          },
        ],
        select: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

  return {
    organization: organization
      ? {
          id: organization.id,
          name: organization.name,
          ownerName: organization.owner.displayName,
          ownerEmail: organization.owner.email,
        }
      : null,
    summary: {
      totalEmployees,
      totalAssignedCourses,
      totalCompletedCourses,
    },
    assignedCourses: assignedCourses.map(({ course }) => {
      const completedEmployees = new Set(
        course.completedByUsers.map((completion) => completion.userId),
      ).size;

      return {
        courseId: course.id,
        courseTitle: course.name,
        completedEmployees,
        totalEmployees,
        completionRate:
          totalEmployees > 0 ? completedEmployees / totalEmployees : 0,
      };
    }),
    bookmarkedCourses: Object.values(
      bookmarkedCoursesByEmployee.reduce<
        Record<number, ManagerBookmarkedCourseSummary>
      >((accumulator, bookmark) => {
        const existing = accumulator[bookmark.course.id];

        if (existing) {
          existing.employeeCount += 1;
          return accumulator;
        }

        accumulator[bookmark.course.id] = {
          courseId: bookmark.course.id,
          courseTitle: bookmark.course.name,
          employeeCount: 1,
          isAssigned: Boolean(
            assignedCourses.find(({ course }) => course.id === bookmark.course.id),
          ),
        };

        return accumulator;
      }, {}),
    )
      .sort((left, right) => {
        if (right.employeeCount !== left.employeeCount) {
          return right.employeeCount - left.employeeCount;
        }

        return left.courseTitle.localeCompare(right.courseTitle);
      })
      .slice(0, 10),
  };
}
