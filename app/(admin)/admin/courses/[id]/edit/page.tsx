import { notFound } from "next/navigation";

import { CourseEditForm } from "@/components/courses/course-edit-form";
import { getCourseById } from "@/lib/courses/services";
import { requireAdmin } from "@/lib/auth/auth";
import { acquireCourseEditLock } from "@/lib/courses/edit-lock";

type CourseEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const session = await requireAdmin();
  const { id } = await params;
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) {
    notFound();
  }

  const course = await getCourseById(courseId);

  if (!course) {
    notFound();
  }

  const initialLockState = await acquireCourseEditLock(
    courseId,
    Number(session.user.id),
  );

  console.log("initial", initialLockState);

  return <CourseEditForm course={course} initialLockState={initialLockState} />;
}
