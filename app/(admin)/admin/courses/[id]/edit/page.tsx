import { notFound } from "next/navigation";

import { CourseEditForm } from "@/components/courses/course-edit-form";
import { getCourseByIdAction } from "@/lib/courses/actions";
import { requireAdmin } from "@/lib/auth/auth";

type CourseEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  await requireAdmin();
  const { id } = await params;
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) {
    notFound();
  }

  const course = await getCourseByIdAction(courseId);

  if (!course) {
    notFound();
  }

  return <CourseEditForm course={course} />;
}
