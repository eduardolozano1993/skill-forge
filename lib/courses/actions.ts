"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/auth";
import {
  deleteCacheKeys,
  getManagerDashboardCacheKey,
} from "@/lib/utils/redis/cache";
import {
  toggleCourseSelectionSchema,
  updateCourseContentSchema,
} from "./schemas";
import {
  findCourseById,
  getVisibleCoursesForUser,
  requireEmployeeCourseBookmarkSelection,
  requireEmployeeCourseSelection,
  toggleEmployeeCourseBookmark,
  toggleEmployeeCourseCompletion,
  updateCourse,
} from "./queries";
import type { DashboardCourses } from "./types";

type ToggleActionError = {
  success?: false;
  error: string;
};

type ToggleActionSuccess = {
  success: true;
  error?: undefined;
};

type ToggleCourseSelection = {
  userId: number;
  courseId: number;
  organizationId: number | null;
};

type ToggleCourseActionOptions<TSelection extends ToggleCourseSelection> = {
  loadSelection: (courseId: number) => Promise<TSelection | null>;
  mutateSelection: (selection: TSelection) => Promise<unknown>;
  revalidationPaths?: (courseId: number) => string[];
};

async function toggleCourseAction<TSelection extends ToggleCourseSelection>(
  courseId: number,
  {
    loadSelection,
    mutateSelection,
    revalidationPaths = () => [],
  }: ToggleCourseActionOptions<TSelection>,
): Promise<ToggleActionError | ToggleActionSuccess> {
  const parsedPayload = toggleCourseSelectionSchema.safeParse({ courseId });

  if (!parsedPayload.success) {
    return {
      error: "Invalid course selection.",
    };
  }

  const selectedCourseId = parsedPayload.data.courseId;
  const courseSelection = await loadSelection(selectedCourseId);

  if (!courseSelection) {
    return {
      error: "Course access is no longer available.",
    };
  }

  await mutateSelection(courseSelection);

  await deleteCacheKeys([
    courseSelection.organizationId
      ? getManagerDashboardCacheKey(courseSelection.organizationId)
      : null,
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/courses");

  for (const path of revalidationPaths(selectedCourseId)) {
    revalidatePath(path);
  }

  return {
    success: true,
  };
}

export async function updateCourseContentAction(formData: FormData) {
  const session = await requireAdmin();

  const parsedPayload = updateCourseContentSchema.safeParse({
    courseId: formData.get("courseId"),
    content: formData.get("content"),
  });

  if (!parsedPayload.success) {
    notFound();
  }

  const { courseId, content } = parsedPayload.data;
  const course = await findCourseById(courseId, session);

  if (!course) {
    notFound();
  }

  await updateCourse(courseId, { content });

  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);

  redirect(`/courses/${courseId}`);
}

export async function getDashboardCoursesAction(): Promise<DashboardCourses> {
  const { courses, bookmarkedCourseIds, completedCourseIds } =
    await getVisibleCoursesForUser();

  return {
    assignedCourses: courses.filter((course) => course.isAssigned),
    bookmarkedCourses: courses.filter((course) =>
      bookmarkedCourseIds.has(course.id),
    ),
    completedCourses: courses.filter((course) =>
      completedCourseIds.has(course.id),
    ),
  };
}

export async function toggleCourseBookmarkAction(courseId: number) {
  return toggleCourseAction(courseId, {
    loadSelection: requireEmployeeCourseBookmarkSelection,
    mutateSelection: toggleEmployeeCourseBookmark,
    revalidationPaths: (selectedCourseId) => [`/courses/${selectedCourseId}`],
  });
}

export async function toggleCourseCompletionAction(courseId: number) {
  return toggleCourseAction(courseId, {
    loadSelection: requireEmployeeCourseSelection,
    mutateSelection: toggleEmployeeCourseCompletion,
    revalidationPaths: (selectedCourseId) => [`/courses/${selectedCourseId}`],
  });
}
