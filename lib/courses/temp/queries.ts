import { prisma } from "@/lib/prisma/prisma";
import { readThroughJsonCache } from "@/lib/redis/cache";
import { AdminTableCourseRow, CourseDetail } from "./types";
import { getCourseByIdCacheKey } from "./utils";
import { matchesSearch } from "@/lib/table/utils";
import { sortByTextAndId } from "@/lib/utils/textSort";

const courseDetailSelect = {
  id: true,
  name: true,
  summary: true,
  content: true,
  status: true,
} as const;

export async function queryCourses(search: string) {
  let courses;

  courses = await prisma.course.findMany({
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
  });

  courses = courses.map<AdminTableCourseRow>((course) => ({
    id: course.id,
    name: course.name,
    summary: course.summary,
    status: course.status,
    assignedOrganizationCount: course._count.organizations,
    completedUserCount: course._count.completedByUsers,
    bookmarkCount: course._count.bookmarks,
  }));

  if (search.trim().length) {
    courses = courses.filter((course) => matchesSearch(search, [course.name]));
  }

  courses = courses.sort((left, right) =>
    sortByTextAndId(left.name, right.name, left, right),
  );

  return {
    search,
    courses,
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
