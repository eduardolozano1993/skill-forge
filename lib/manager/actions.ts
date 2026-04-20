"use server";

import { revalidatePath } from "next/cache";
import { managerCourseSelectionSchema } from "./schemas";
import {
  assignBookmarkedCourse,
  assignCourseToOrganization,
  removeAssignedCourseFromOrganization,
} from "./services";

type InvalidManagerCourseSelectionResult = {
  success: false;
  error: string;
};

async function runManagerCourseAction<T extends { success: boolean }>(
  courseId: number,
  action: (courseId: number) => Promise<T>,
): Promise<T | InvalidManagerCourseSelectionResult> {
  const parsedPayload = managerCourseSelectionSchema.safeParse({ courseId });

  if (!parsedPayload.success) {
    return {
      success: false,
      error: "Invalid course selection.",
    };
  }

  const result = await action(parsedPayload.data.courseId);

  if (result.success) {
    revalidateManagerPaths();
  }

  return result;
}

function revalidateManagerPaths() {
  revalidatePath("/manager");
  revalidatePath("/courses");
  revalidatePath("/dashboard");
}

export async function assignCourseToOrganizationAction(courseId: number) {
  return runManagerCourseAction(courseId, assignCourseToOrganization);
}

export async function assignBookmarkedCourseToOrganizationAction(
  courseId: number,
) {
  return runManagerCourseAction(courseId, assignBookmarkedCourse);
}

export async function removeAssignedCourseFromOrganizationAction(
  courseId: number,
) {
  return runManagerCourseAction(courseId, removeAssignedCourseFromOrganization);
}
