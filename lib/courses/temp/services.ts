import type { CourseDetail } from "@/lib/courses/temp/types";
import { isAdmin } from "@/lib/utils/checkUserType";
import { findActiveCoursesById, findCourseById } from "./queries";

export async function getCourseById(
  courseId: number,
): Promise<CourseDetail | null> {
  let course;
  const isCurrentUserAdmin = await isAdmin();

  if (isCurrentUserAdmin) {
    course = await findCourseById(courseId);
  } else {
    course = await findActiveCoursesById(courseId);
  }

  if (!course) {
    return null;
  }

  return course;
}
