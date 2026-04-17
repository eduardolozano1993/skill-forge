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

type CourseStatus = "ACTIVE" | "DEACTIVATED";

type CourseUserState = {
  organizations?: Array<{ courseId: number }>;
  bookmarks?: Array<{ courseId: number }>;
  completedByUsers?: Array<{ courseId: number }>;
};

type CourseDetailSource = {
  id: number;
  name: string;
  summary: string;
  content: string;
  status: CourseStatus;
} & CourseUserState;

type UpdateCourseInput = Partial<
  Pick<CourseDetailSource, "name" | "summary" | "content" | "status">
>;

type CourseContext = {
  userId: number;
  organizationId: number;
};

export type EmployeeCourseSelection = {
  userId: number;
  organizationId: number | null;
  courseId: number;
};

export type EmployeeCourseBookmarkSelection = {
  userId: number;
  organizationId: number | null;
  courseId: number;
};

function getCourseContext(session: Session): CourseContext {
  return {
    userId: Number(session.user.id),
    organizationId: Number(session.user.organizationId),
  };
}

function buildCourseSearchWhere(search: string): Prisma.CourseWhereInput {
  return search
    ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {};
}

function buildActiveCourseWhere(search: string): Prisma.CourseWhereInput {
  return {
    status: "ACTIVE",
    ...buildCourseSearchWhere(search),
  };
}

function buildCourseOrderBy(): Prisma.CourseOrderByWithRelationInput[] {
  return [
    {
      name: "asc",
    },
    {
      id: "asc",
    },
  ];
}

function buildPaginationArgs({
  totalRows,
  page,
  pageSize,
}: {
  totalRows: number;
  page: number;
  pageSize: number;
}) {
  const pagination = buildTablePagination(totalRows, page, pageSize);
  const skip =
    totalRows === 0 ? 0 : (pagination.page - 1) * pagination.pageSize;

  return {
    pagination,
    skip,
    take: pagination.pageSize,
  };
}

function buildCourseDetailSelect({
  userId,
  organizationId,
}: CourseContext) {
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

function toCourseDetail({
  course,
  assignedCourseIds,
  bookmarkedCourseIds,
  completedCourseIds,
}: {
  course: CourseDetailSource;
  assignedCourseIds?: Set<number>;
  bookmarkedCourseIds?: Set<number>;
  completedCourseIds?: Set<number>;
}) {
  return {
    id: course.id,
    name: course.name,
    summary: course.summary,
    content: course.content,
    status: course.status,
    isAssigned: assignedCourseIds
      ? assignedCourseIds.has(course.id)
      : (course.organizations?.length ?? 0) > 0,
    isBookmarked: bookmarkedCourseIds
      ? bookmarkedCourseIds.has(course.id)
      : (course.bookmarks?.length ?? 0) > 0,
    isCompleted: completedCourseIds
      ? completedCourseIds.has(course.id)
      : (course.completedByUsers?.length ?? 0) > 0,
  };
}

export async function queryAdminCourses(
  search: string,
  page: number,
): Promise<TableResult<AdminTableCourseRow>> {
  const where = buildCourseSearchWhere(search);

  const totalRows = await prisma.course.count({
    where,
  });

  const { pagination, skip, take } = buildPaginationArgs({
    totalRows,
    page,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
  });

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
    orderBy: buildCourseOrderBy(),
    skip,
    take,
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
  const courseContext = getCourseContext(session);
  const where = buildActiveCourseWhere(search);

  const totalRows = await prisma.course.count({
    where,
  });

  const { pagination, skip, take } = buildPaginationArgs({
    totalRows,
    page,
    pageSize: 12,
  });

  const courses = await prisma.course.findMany({
    where,
    select: buildCourseDetailSelect(courseContext),
    orderBy: buildCourseOrderBy(),
    skip,
    take,
  });

  const rows = courses.map<CourseDetail>((course) =>
    toCourseDetail({ course }),
  );

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
  const courseContext = getCourseContext(session);

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: buildCourseDetailSelect(courseContext),
  });

  if (!course) {
    return null;
  }

  return toCourseDetail({ course });
}

export async function findActiveCoursesById(
  courseId: number,
  session: Session,
): Promise<CourseDetail | null> {
  const courseContext = getCourseContext(session);

  const course = await prisma.course.findFirst({
    where: {
      ...buildActiveCourseWhere(""),
      id: courseId,
    },
    select: buildCourseDetailSelect(courseContext),
  });

  if (!course || course.status !== "ACTIVE") {
    return null;
  }

  return toCourseDetail({ course });
}

export async function updateCourse(
  courseId: number,
  content: UpdateCourseInput,
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

  const serializedCourses = courses.map((course) =>
    toCourseDetail({
      course,
      assignedCourseIds,
      bookmarkedCourseIds,
      completedCourseIds,
    }),
  );

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
  } satisfies EmployeeCourseSelection;
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
  } satisfies EmployeeCourseBookmarkSelection;
}

export async function toggleEmployeeCourseBookmark({
  userId,
  courseId,
}: EmployeeCourseBookmarkSelection) {
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: {
      courseId: true,
    },
  });

  if (existingBookmark) {
    return prisma.bookmark.deleteMany({
      where: {
        userId,
        courseId,
      },
    });
  }

  return prisma.bookmark.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {},
    create: {
      userId,
      courseId,
    },
  });
}

export async function toggleEmployeeCourseCompletion({
  userId,
  courseId,
}: EmployeeCourseSelection) {
  const existingCompletion = await prisma.completedCourse.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    select: {
      courseId: true,
    },
  });

  if (existingCompletion) {
    return prisma.completedCourse.deleteMany({
      where: {
        userId,
        courseId,
      },
    });
  }

  return prisma.completedCourse.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {},
    create: {
      userId,
      courseId,
    },
  });
}
