import type {
  AdminTableCourseRow,
  CourseDetail,
} from "@/lib/courses/temp/types";
import {
  findActiveCoursesById,
  findCourseById,
  queryAdminCourses,
  queryCourses,
} from "./queries";
import { requireAdmin, requireAuth } from "@/lib/auth/auth";
import { normalizeTablePage, normalizeTableSearch } from "@/lib/table/utils";
import type { TableResult } from "@/lib/table/types";

export async function getCourseById(
  courseId: number,
): Promise<CourseDetail | null> {
  let course;
  const session = await requireAuth();

  if (session.user.userType === "ADMIN") {
    course = await findCourseById(courseId, session);
  } else {
    course = await findActiveCoursesById(courseId, session);
  }

  if (!course) {
    return null;
  }

  return course;
}

export async function getAdminCoursesTableData(
  search?: string | null,
  page?: number | null,
): Promise<TableResult<AdminTableCourseRow>> {
  await requireAdmin();

  const normalizedSearch = normalizeTableSearch(search);
  const normalizedPage = normalizeTablePage(page);

  return await queryAdminCourses(normalizedSearch, normalizedPage);
}

export async function getCourses(
  session: any,
  search?: string | null,
  page?: number | null,
) {
  const normalizedSearch = normalizeTableSearch(search);
  const normalizedPage = normalizeTablePage(page);

  return await queryCourses(session, normalizedSearch, normalizedPage);
}
