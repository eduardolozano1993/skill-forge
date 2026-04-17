"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";
import {
  deleteCacheKeys,
  getManagerDashboardCacheKey,
} from "@/lib/redis/cache";
import {
  toggleCourseSelectionSchema,
  updateCourseContentSchema,
} from "./schemas";
import {
  findCourseById,
  getVisibleCoursesForUser,
  requireEmployeeCourseBookmarkSelection,
  requireEmployeeCourseSelection,
  updateCourse,
} from "./queries";
import type { DashboardCourses } from "./types";

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
  const parsedPayload = toggleCourseSelectionSchema.safeParse({ courseId });

  if (!parsedPayload.success) {
    return {
      error: "Invalid course selection.",
    };
  }

  const courseSelection = await requireEmployeeCourseBookmarkSelection(
    parsedPayload.data.courseId,
  );

  if (!courseSelection) {
    return {
      error: "Course access is no longer available.",
    };
  }

  if (courseSelection.isBookmarked) {
    await prisma.bookmark.delete({
      where: {
        userId_courseId: {
          userId: courseSelection.userId,
          courseId: courseSelection.courseId,
        },
      },
    });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: courseSelection.userId,
        courseId: courseSelection.courseId,
      },
    });
  }

  await deleteCacheKeys([
    courseSelection.organizationId
      ? getManagerDashboardCacheKey(courseSelection.organizationId)
      : null,
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath(`/courses/${parsedPayload.data.courseId}`);

  return {
    success: true,
    isBookmarked: !courseSelection.isBookmarked,
  };
}

export async function toggleCourseCompletionAction(courseId: number) {
  const parsedPayload = toggleCourseSelectionSchema.safeParse({ courseId });

  if (!parsedPayload.success) {
    return {
      error: "Invalid course selection.",
    };
  }

  const courseSelection = await requireEmployeeCourseSelection(
    parsedPayload.data.courseId,
  );

  if (!courseSelection) {
    return {
      error: "Course access is no longer available.",
    };
  }

  if (courseSelection.isCompleted) {
    await prisma.completedCourse.delete({
      where: {
        userId_courseId: {
          userId: courseSelection.userId,
          courseId: courseSelection.courseId,
        },
      },
    });
  } else {
    await prisma.completedCourse.create({
      data: {
        userId: courseSelection.userId,
        courseId: courseSelection.courseId,
      },
    });
  }

  await deleteCacheKeys([
    courseSelection.organizationId
      ? getManagerDashboardCacheKey(courseSelection.organizationId)
      : null,
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/courses");

  return {
    success: true,
    isCompleted: !courseSelection.isCompleted,
  };
}
