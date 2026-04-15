import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/prisma";
import { readThroughJsonCache } from "@/lib/redis/cache";
import { AdminTableCourseRow, CourseDetail } from "./types";
import { getCourseByIdCacheKey } from "./utils";
import {
  buildTablePagination,
  DEFAULT_TABLE_PAGE_SIZE,
} from "@/lib/table/utils";
import type { TableResult } from "@/lib/table/types";

const courseDetailSelect = {
  id: true,
  name: true,
  summary: true,
  content: true,
  status: true,
} as const;

export async function queryCourses(
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
    search: search,
    rows,
    pagination,
  };
}

async function queryCourseById(courseId: number): Promise<CourseDetail | null> {
  return prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: courseDetailSelect,
  });
}

async function queryActiveCourseById(
  courseId: number,
): Promise<CourseDetail | null> {
  return prisma.course.findFirst({
    where: {
      id: courseId,
      status: "ACTIVE",
    },
    select: courseDetailSelect,
  });
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

export async function findCourseById(
  courseId: number,
): Promise<CourseDetail | null> {
  return readThroughJsonCache(getCourseByIdCacheKey(courseId), () =>
    queryCourseById(courseId),
  );
}

export async function findActiveCoursesById(
  courseId: number,
): Promise<CourseDetail | null> {
  const course = await readThroughJsonCache(
    getCourseByIdCacheKey(courseId),
    () => queryActiveCourseById(courseId),
  );

  if (!course || course.status !== "ACTIVE") {
    return null;
  }

  return course;
}
