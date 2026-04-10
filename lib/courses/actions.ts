"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth/auth";
import type { AppCourse, DashboardCourses } from "@/lib/courses/types";

const updateCourseContentSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  content: z.string().trim().min(1, "Course content is required."),
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

export async function getCourseByIdAction(courseId: number) {
  const { courses } = await getVisibleCoursesForUser();

  return courses.find((course) => course.id === courseId) ?? null;
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
