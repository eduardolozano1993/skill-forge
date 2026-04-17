import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/prisma";
import { AdminTableCourseRow, CourseDetail } from "./types";
import {
  buildTablePagination,
  DEFAULT_TABLE_PAGE_SIZE,
} from "@/lib/table/utils";
import type { TableResult } from "@/lib/table/types";
import { requireAuth, requireEmployee } from "@/lib/auth/auth";
import { Session } from "next-auth";

function buildCourseDetailSelect({
  userId,
  organizationId,
}: {
  userId: number;
  organizationId: number;
}) {
  return {
    id: true,
    name: true,
    summary: true,
    content: true,
    status: true,
    organizations: {
      where: {
        organizationId,
      },
      select: {
        courseId: true,
      },
    },
    bookmarks: {
      where: {
        userId,
      },
      select: {
        courseId: true,
      },
    },
    completedByUsers: {
      where: {
        userId,
      },
      select: {
        courseId: true,
      },
    },
  } satisfies Prisma.CourseSelect;
}

function serializeCourses({
  courses,
  assignedCourseIds,
  bookmarkedCourseIds,
  completedCourseIds,
}: {
  courses: Array<{
    id: number;
    name: string;
    summary: string;
    content: string;
    status: "ACTIVE" | "DEACTIVATED";
  }>;
  assignedCourseIds: Set<number>;
  bookmarkedCourseIds: Set<number>;
  completedCourseIds: Set<number>;
}) {
  return courses.map<CourseDetail>((course) => ({
    id: course.id,
    name: course.name,
    summary: course.summary,
    content: course.content,
    status: course.status,
    isAssigned: assignedCourseIds.has(course.id),
    isBookmarked: bookmarkedCourseIds.has(course.id),
    isCompleted: completedCourseIds.has(course.id),
  }));
}

export async function queryAdminCourses(
  search: string,
  page: number,
): Promise<TableResult<AdminTableCourseRow>> {
  const where: Prisma.CourseWhereInput = search
    ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};

  const totalRows = await prisma.course.count({
    where,
  });

  const pagination = buildTablePagination(
    totalRows,
    page,
    DEFAULT_TABLE_PAGE_SIZE,
  );

  const skip =
    totalRows === 0 ? 0 : (pagination.page - 1) * pagination.pageSize;

  const courses = await prisma.course.findMany({
    where,
    select: {
      id: true,
      name: true,
      summary: true,
      status: true,
      _count: {
        select: {
          organizations: true,
          completedByUsers: true,
          bookmarks: true,
        },
      },
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        id: "asc",
      },
    ],
    skip,
    take: pagination.pageSize,
  });

  const rows = courses.map<AdminTableCourseRow>((course) => ({
    id: course.id,
    name: course.name,
    summary: course.summary,
    status: course.status,
    assignedOrganizationCount: course._count.organizations,
    completedUserCount: course._count.completedByUsers,
    bookmarkCount: course._count.bookmarks,
  }));

  return {
    search,
    rows,
    pagination,
  };
}

export async function queryCourses(
  session: Session,
  search: string,
  page: number,
): Promise<TableResult<CourseDetail>> {
  const userId = Number(session.user.id);
  const organizationId = Number(session.user.organizationId);

  const where: Prisma.CourseWhereInput = {
    status: "ACTIVE",
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {}),
  };

  const totalRows = await prisma.course.count({
    where,
  });

  const pagination = buildTablePagination(totalRows, page, 12);

  const skip =
    totalRows === 0 ? 0 : (pagination.page - 1) * pagination.pageSize;

  const courses = await prisma.course.findMany({
    where,
    select: buildCourseDetailSelect({ userId, organizationId }),
    orderBy: [
      {
        name: "asc",
      },
      {
        id: "asc",
      },
    ],
    skip,
    take: pagination.pageSize,
  });

  const rows = courses.map<CourseDetail>((course) => ({
    id: course.id,
    name: course.name,
    summary: course.summary,
    content: course.content,
    status: course.status,
    isBookmarked: course.bookmarks.length > 0,
    isCompleted: course.completedByUsers.length > 0,
    isAssigned: course.organizations.length > 0,
  }));

  return {
    search,
    rows,
    pagination,
  };
}

export async function findCourseById(
  courseId: number,
  session: Session,
): Promise<CourseDetail | null> {
  if (!session) {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        name: true,
        summary: true,
        content: true,
        status: true,
      },
    });

    if (!course) {
      return null;
    }

    return {
      ...course,
      isAssigned: false,
      isBookmarked: false,
      isCompleted: false,
    };
  }

  const userId = Number(session.user.id);
  const organizationId = Number(session.user.organizationId);

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: buildCourseDetailSelect({ userId, organizationId }),
  });

  if (!course) {
    return null;
  }

  const courseDetail: CourseDetail = {
    ...course,
    isAssigned: course.organizations.length > 0,
    isBookmarked: course.bookmarks.length > 0,
    isCompleted: course.completedByUsers.length > 0,
  };

  return courseDetail;
}

export async function findActiveCoursesById(
  courseId: number,
  session: Session,
): Promise<CourseDetail | null> {
  const userId = Number(session.user.id);
  const organizationId = Number(session.user.organizationId);

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      status: "ACTIVE",
    },
    select: buildCourseDetailSelect({ userId, organizationId }),
  });

  if (!course || course.status !== "ACTIVE") {
    return null;
  }

  const courseDetail: CourseDetail = {
    ...course,
    isAssigned: course.organizations.length > 0,
    isBookmarked: course.bookmarks.length > 0,
    isCompleted: course.completedByUsers.length > 0,
  };

  return courseDetail;
}

export async function updateCourse(
  courseId: number,
  content: Partial<CourseDetail>,
) {
  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: content,
  });
}

export async function getVisibleCoursesForUser() {
  const session = await requireAuth();

  const [courses, organizationCourses, bookmarks, completedCourses] =
    await Promise.all([
      prisma.course.findMany({
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          name: "asc",
        },
      }),
      session.user.organizationId
        ? prisma.organizationCourse.findMany({
            where: {
              organizationId: session.user.organizationId,
            },
            select: {
              courseId: true,
            },
          })
        : Promise.resolve([]),
      prisma.bookmark.findMany({
        where: {
          userId: Number(session.user.id),
        },
        select: {
          courseId: true,
        },
      }),
      prisma.completedCourse.findMany({
        where: {
          userId: Number(session.user.id),
        },
        select: {
          courseId: true,
        },
      }),
    ]);

  const assignedCourseIds = new Set(
    organizationCourses.map((course) => course.courseId),
  );
  const bookmarkedCourseIds = new Set(
    bookmarks.map((bookmark) => bookmark.courseId),
  );
  const completedCourseIds = new Set(
    completedCourses.map((course) => course.courseId),
  );

  const serializedCourses = serializeCourses({
    courses,
    assignedCourseIds,
    bookmarkedCourseIds,
    completedCourseIds,
  });

  return {
    courses: serializedCourses,
    bookmarkedCourseIds,
    completedCourseIds,
  };
}

export async function requireEmployeeCourseSelection(courseId: number) {
  const session = await requireEmployee();
  const userId = Number(session.user.id);
  const organizationId = session.user.organizationId;

  if (!organizationId) {
    return null;
  }

  const [course, assignedCourse, existingBookmark, existingCompletion] =
    await Promise.all([
      prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          id: true,
          status: true,
        },
      }),
      prisma.organizationCourse.findUnique({
        where: {
          organizationId_courseId: {
            organizationId,
            courseId,
          },
        },
        select: {
          courseId: true,
        },
      }),
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
      prisma.completedCourse.findUnique({
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
    ]);

  if (!course || course.status !== "ACTIVE") {
    return null;
  }

  if (!assignedCourse && !existingBookmark && !existingCompletion) {
    return null;
  }

  return {
    userId,
    organizationId,
    courseId,
    isBookmarked: Boolean(existingBookmark),
    isCompleted: Boolean(existingCompletion),
  };
}

export async function requireEmployeeCourseBookmarkSelection(courseId: number) {
  const session = await requireEmployee();
  const userId = Number(session.user.id);
  const organizationId = session.user.organizationId;

  const [course, existingBookmark] = await Promise.all([
    prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        status: true,
      },
    }),
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
  ]);

  if (!course || course.status !== "ACTIVE") {
    return null;
  }

  return {
    userId,
    organizationId,
    courseId,
    isBookmarked: Boolean(existingBookmark),
  };
}
