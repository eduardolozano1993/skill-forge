"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/auth";
import {
  acquireCourseEditLock,
  refreshCourseEditLock,
  releaseCourseEditLock,
} from "@/lib/courses/edit-lock";
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

export type UpdateCourseContentState = {
  error?: string;
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

export async function updateCourseContentAction(
  _previousState: UpdateCourseContentState,
  formData: FormData,
) {
  const session = await requireAdmin();

  const parsedPayload = updateCourseContentSchema.safeParse({
    courseId: formData.get("courseId"),
    contentVersion: formData.get("contentVersion"),
    content: formData.get("content"),
  });

  if (!parsedPayload.success) {
    notFound();
  }

  const { courseId, content, contentVersion } = parsedPayload.data;
  const course = await findCourseById(courseId, session);

  if (!course) {
    notFound();
  }

  const adminUserId = Number(session.user.id);
  const lockState = await acquireCourseEditLock(courseId, adminUserId);

  if (lockState.status === "conflict") {
    return {
      error:
        "Another admin is already editing this course. Refresh the page and try again once the lock clears.",
    };
  }

  const updatedCourse = await updateCourse(courseId, {
    content,
    expectedContentVersion: contentVersion,
  });

  if (!updatedCourse) {
    return {
      error:
        "This course was updated from another session. Refresh the page to load the latest content before saving again.",
    };
  }

  await releaseCourseEditLock(courseId, adminUserId);

  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);

  redirect(`/courses/${courseId}`);
}

export async function refreshCourseEditLockAction(courseId: number) {
  const session = await requireAdmin();

  const refreshed = await refreshCourseEditLock(
    courseId,
    Number(session.user.id),
  );

  return {
    success: refreshed,
  };
}

export async function releaseCourseEditLockAction(courseId: number) {
  const session = await requireAdmin();

  await releaseCourseEditLock(courseId, Number(session.user.id));
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
