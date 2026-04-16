"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma/prisma";
import { requireAuth, requireEmployee } from "@/lib/auth/auth";
import {
  deleteCacheKeys,
  getCourseDetailActionStateCacheKey,
  getManagerDashboardCacheKey,
} from "@/lib/redis/cache";
import type { AppCourse, DashboardCourses } from "@/lib/courses/temp/types";
import { toggleCourseSelectionSchema } from "./temp/schemas";

function serializeCourses({
  courses,
  assignedCourseIds,
  bookmarkedCourseIds,
  completedCourseIds,
}: {
  courses: Array<{
    id: number;
    name: string;
    summary: string;
    content: string;
  }>;
  assignedCourseIds: Set<number>;
  bookmarkedCourseIds: Set<number>;
  completedCourseIds: Set<number>;
}) {
  return courses.map<AppCourse>((course) => ({
    id: course.id,
    name: course.name,
    summary: course.summary,
    content: course.content,
    isAssigned: assignedCourseIds.has(course.id),
    isBookmarked: bookmarkedCourseIds.has(course.id),
    isCompleted: completedCourseIds.has(course.id),
  }));
}

async function getVisibleCoursesForUser() {
  const session = await requireAuth();

  const [courses, organizationCourses, bookmarks, completedCourses] =
    await Promise.all([
      prisma.course.findMany({
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          name: "asc",
        },
      }),
      session.user.organizationId
        ? prisma.organizationCourse.findMany({
            where: {
              organizationId: session.user.organizationId,
            },
            select: {
              courseId: true,
            },
          })
        : Promise.resolve([]),
      prisma.bookmark.findMany({
        where: {
          userId: Number(session.user.id),
        },
        select: {
          courseId: true,
        },
      }),
      prisma.completedCourse.findMany({
        where: {
          userId: Number(session.user.id),
        },
        select: {
          courseId: true,
        },
      }),
    ]);

  const assignedCourseIds = new Set(
    organizationCourses.map((course) => course.courseId),
  );
  const bookmarkedCourseIds = new Set(
    bookmarks.map((bookmark) => bookmark.courseId),
  );
  const completedCourseIds = new Set(
    completedCourses.map((course) => course.courseId),
  );

  const serializedCourses = serializeCourses({
    courses,
    assignedCourseIds,
    bookmarkedCourseIds,
    completedCourseIds,
  });

  return {
    courses: serializedCourses,
    bookmarkedCourseIds,
    completedCourseIds,
  };
}

async function requireEmployeeCourseSelection(courseId: number) {
  const session = await requireEmployee();
  const userId = Number(session.user.id);
  const organizationId = session.user.organizationId;

  if (!organizationId) {
    return null;
  }

  const [course, assignedCourse, existingBookmark, existingCompletion] =
    await Promise.all([
      prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          id: true,
          status: true,
        },
      }),
      prisma.organizationCourse.findUnique({
        where: {
          organizationId_courseId: {
            organizationId,
            courseId,
          },
        },
        select: {
          courseId: true,
        },
      }),
      prisma.bookmark.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        select: {
          courseId: true,
        },
      }),
      prisma.completedCourse.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        select: {
          courseId: true,
        },
      }),
    ]);

  if (!course || course.status !== "ACTIVE") {
    return null;
  }

  if (!assignedCourse && !existingBookmark && !existingCompletion) {
    return null;
  }

  return {
    userId,
    organizationId,
    courseId,
    isBookmarked: Boolean(existingBookmark),
    isCompleted: Boolean(existingCompletion),
  };
}

async function requireEmployeeCourseBookmarkSelection(courseId: number) {
  const session = await requireEmployee();
  const userId = Number(session.user.id);
  const organizationId = session.user.organizationId;

  const [course, existingBookmark] = await Promise.all([
    prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        status: true,
      },
    }),
    prisma.bookmark.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      select: {
        courseId: true,
      },
    }),
  ]);

  if (!course || course.status !== "ACTIVE") {
    return null;
  }

  return {
    userId,
    organizationId,
    courseId,
    isBookmarked: Boolean(existingBookmark),
  };
}

export async function getCoursesAction() {
  const { courses } = await getVisibleCoursesForUser();

  return courses;
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
    getCourseDetailActionStateCacheKey(
      courseSelection.courseId,
      courseSelection.userId,
    ),
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
    getCourseDetailActionStateCacheKey(
      courseSelection.courseId,
      courseSelection.userId,
    ),
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
