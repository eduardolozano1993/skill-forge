import { prisma } from "@/lib/prisma/prisma";
import { CourseDetail } from "./types";

const courseDetailSelect = {
  id: true,
  name: true,
  summary: true,
  content: true,
} as const;

export async function findCourseById(
  courseId: number,
): Promise<CourseDetail | null> {
  return await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: courseDetailSelect,
  });
}

export async function findActiveCoursesById(
  courseId: number,
): Promise<CourseDetail | null> {
  return await prisma.course.findFirst({
    where: {
      id: courseId,
      status: "ACTIVE",
    },
    select: courseDetailSelect,
  });
}
