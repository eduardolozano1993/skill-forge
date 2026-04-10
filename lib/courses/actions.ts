"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma/prisma";
import { requireAdmin, requireAuth, requireEmployee } from "@/lib/auth/auth";
import type { AppCourse, DashboardCourses } from "@/lib/courses/types";

const updateCourseContentSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  content: z.string().trim().min(1, "Course content is required."),
});

const toggleCourseSelectionSchema = z.object({
  courseId: z.number().int().positive(),
});

function getCourseContentText(content: unknown) {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .filter((item): item is string => typeof item === "string")
      .join("\n\n");
  }

  if (content && typeof content === "object") {
    return JSON.stringify(content, null, 2);
  }

  return "";
}

function serializeCourses({
  courses,
  assignedCourseIds,
}: {
  courses: Array<{
    id: number;
    name: string;
    summary: string;
    content: unknown;
  }>;
  assignedCourseIds: Set<number>;
}) {
  return courses.map<AppCourse>((course) => ({
    id: course.id,
    title: course.name,
    summary: course.summary,
    content: getCourseContentText(course.content),
    isAssigned: assignedCourseIds.has(course.id),
  }));
}

async function getVisibleCoursesForUser() {
  const session = await requireAuth();

  const [courses, organizationCourses, bookmarks, completedCourses] =
    await Promise.all([
      prisma.course.findMany({
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

  const [assignedCourse, existingBookmark, existingCompletion] = await Promise.all([
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

  if (!assignedCourse && !existingBookmark && !existingCompletion) {
    return null;
  }

  return {
    userId,
    courseId,
    isBookmarked: Boolean(existingBookmark),
    isCompleted: Boolean(existingCompletion),
  };
}

async function requireEmployeeCourseBookmarkSelection(courseId: number) {
  const session = await requireEmployee();
  const userId = Number(session.user.id);

  const [course, existingBookmark] = await Promise.all([
    prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
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

  if (!course) {
    return null;
  }

  return {
    userId,
    courseId,
    isBookmarked: Boolean(existingBookmark),
  };
}

export async function getCoursesAction() {
  const { courses } = await getVisibleCoursesForUser();

  return courses;
}

export async function getCoursesPageDataAction() {
  const session = await requireAuth();
  const { courses, bookmarkedCourseIds, completedCourseIds } =
    await getVisibleCoursesForUser();

  return {
    courses,
    bookmarkedCourseIds: Array.from(bookmarkedCourseIds),
    completedCourseIds: Array.from(completedCourseIds),
    userType: session.user.userType,
  };
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

export async function getCourseByIdAction(courseId: number) {
  const { courses } = await getVisibleCoursesForUser();

  return courses.find((course) => course.id === courseId) ?? null;
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

  revalidatePath("/dashboard");
  revalidatePath("/courses");

  return {
    success: true,
    isCompleted: !courseSelection.isCompleted,
  };
}

export async function updateCourseContentAction(formData: FormData) {
  await requireAdmin();

  const parsedPayload = updateCourseContentSchema.safeParse({
    courseId: formData.get("courseId"),
    content: formData.get("content"),
  });

  if (!parsedPayload.success) {
    notFound();
  }

  const { courseId, content } = parsedPayload.data;

  const existingCourse = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
    },
  });

  if (!existingCourse) {
    notFound();
  }

  await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      content,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);

  redirect(`/courses/${courseId}`);
}
