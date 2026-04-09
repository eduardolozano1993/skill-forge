import { notFound } from "next/navigation";

import { CourseEditForm } from "@/components/courses/course-edit-form";
import { getCourseById, mockCourses } from "@/lib/mock-courses";

type CourseEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  return mockCourses.map((course) => ({
    id: course.id.toString(),
  }));
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const { id } = await params;
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) {
    notFound();
  }

  const course = await getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return <CourseEditForm course={course} />;
}
