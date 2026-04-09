import Link from "next/link";
import { Pencil } from "lucide-react";

import { CourseContentView } from "@/components/courses/course-content-view";
import { getCourseById, mockCourses } from "@/lib/mock-courses";

type CourseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  return mockCourses.map((course) => ({
    id: course.id.toString(),
  }));
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) {
    throw new Error(`Invalid course id: ${id}`);
  }

  const course = await getCourseById(courseId);

  if (!course) {
    throw new Error(`Course not found for id: ${courseId}`);
  }

  return (
    <article className="space-y-lg">
      <header className="space-y-sm">
        <div className="flex items-center justify-between gap-md">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Course</p>
          <Link
            href={`/admin/courses/${course.id}/edit`}
            aria-label={`Edit ${course.title}`}
            className="rounded-full p-2 text-brand transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand)/0.35)]"
          >
            <Pencil className="size-5" />
          </Link>
        </div>
        <div>
          <div>
            <h1 className="font-heading text-3xl font-semibold text-text-strong">
              {course.title}
            </h1>
          </div>
          <p className="mt-xs max-w-3xl text-base text-text-soft">{course.summary}</p>
        </div>
      </header>

      <CourseContentView course={course} />
    </article>
  );
}
