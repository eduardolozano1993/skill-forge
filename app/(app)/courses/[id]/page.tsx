import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { CourseContentView } from "@/components/courses/course-content-view";
import { ManagerCourseAssignButton } from "@/components/manager/manager-course-assign-button";
import { getCourseByIdAction } from "@/lib/courses/actions";
import { prisma } from "@/lib/prisma/prisma";
import { requireAuth } from "@/lib/auth/auth";

type CourseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const session = await requireAuth();
  const { id } = await params;
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) {
    notFound();
  }

  const course = await getCourseByIdAction(courseId);
  const canEditCourse = session.user.userType === "ADMIN";
  const isManager = session.user.userType === "MANAGER";

  if (!course) {
    notFound();
  }

  const managerOrganization =
    isManager && session.user.organizationId
      ? await prisma.organization.findUnique({
          where: {
            id: session.user.organizationId,
          },
          select: {
            name: true,
            courses: {
              where: {
                courseId,
              },
              select: {
                courseId: true,
              },
            },
          },
        })
      : null;

  const managerHasAssignedCourse = Boolean(
    managerOrganization?.courses.some((assignedCourse) => assignedCourse.courseId === courseId),
  );

  return (
    <article className="space-y-lg">
      <header className="space-y-sm">
        <div className="flex items-center justify-between gap-md">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Course</p>
          <div className="flex items-center gap-xs">
            {isManager && managerOrganization ? (
              <ManagerCourseAssignButton
                courseId={course.id}
                courseTitle={course.title}
                organizationName={managerOrganization.name}
                isAssigned={managerHasAssignedCourse}
              />
            ) : null}
            {canEditCourse ? (
              <Link
                href={`/admin/courses/${course.id}/edit`}
                aria-label={`Edit ${course.title}`}
                className="rounded-full p-2 text-brand transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand)/0.35)]"
              >
                <Pencil className="size-5" />
              </Link>
            ) : null}
          </div>
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

      <CourseContentView content={course.content} />
    </article>
  );
}
