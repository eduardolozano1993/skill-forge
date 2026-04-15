"use server";

import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/auth";
import { deleteCacheKeys } from "@/lib/redis/cache";
import { updateCourseContentSchema } from "./schemas";
import { getCourseByIdCacheKey } from "./utils";
import { findCourseById, updateCourse } from "./queries";
import { revalidatePath } from "next/cache";

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
  const course = await findCourseById(courseId);

  if (!course) {
    notFound();
  }

  await updateCourse(courseId, { content });
  await deleteCacheKeys([getCourseByIdCacheKey(courseId)]);

  revalidatePath("/courses");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/edit`);

  redirect(`/courses/${courseId}`);
}
