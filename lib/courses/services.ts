import type { AdminTableCourseRow, CourseDetail } from "@/lib/courses/types";
import {
  findActiveCoursesById,
  findCourseById,
  queryAdminCourses,
  queryCourses,
} from "./queries";
import { requireAdmin, requireAuth } from "@/lib/auth/auth";
import {
  normalizeTablePage,
  normalizeTableSearch,
  TableResult,
} from "@/lib/utils/table/table";

export async function getCourseById(
  courseId: number,
): Promise<CourseDetail | null> {
  const session = await requireAuth();

  if (session.user.userType === "ADMIN") {
    return await findCourseById(courseId, session);
  } else {
    return await findActiveCoursesById(courseId, session);
  }
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
  search?: string | null,
  page?: number | null,
): Promise<TableResult<CourseDetail>> {
  const session = await requireAuth();

  const normalizedSearch = normalizeTableSearch(search);
  const normalizedPage = normalizeTablePage(page);

  return await queryCourses(session, normalizedSearch, normalizedPage);
}
