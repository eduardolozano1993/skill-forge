import { prisma } from "@/lib/prisma/prisma";
import { readThroughJsonCache } from "@/lib/redis/cache";
import { CourseDetail } from "./types";
import { getCourseByIdCacheKey } from "./utils";

const courseDetailSelect = {
  id: true,
  name: true,
  summary: true,
  content: true,
  status: true,
} as const;

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
