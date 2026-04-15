import type {
  AdminTableCourseRow,
  CourseDetail,
} from "@/lib/courses/temp/types";
import { isAdmin } from "@/lib/utils/checkUserType";
import { findActiveCoursesById, findCourseById, queryCourses } from "./queries";
import { requireAdmin } from "@/lib/auth/auth";
import { normalizeTableSearch } from "@/lib/table/utils";

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

export async function getAdminCoursesTableData(
  search?: string | null,
): Promise<{
  search: string;
  courses: AdminTableCourseRow[];
}> {
  await requireAdmin();

  const normalizedSearch = normalizeTableSearch(search);

  return await queryCourses(normalizedSearch);
}
