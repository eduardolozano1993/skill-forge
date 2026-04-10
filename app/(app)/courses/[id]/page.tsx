import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { CourseContentView } from "@/components/courses/course-content-view";
import { EmployeeCourseBookmarkButton } from "@/components/employee/employee-course-bookmark-button";
import { EmployeeCourseOrgIndicator } from "@/components/employee/employee-course-org-indicator";
import { ManagerCourseAssignButton } from "@/components/manager/manager-course-assign-button";
import { getCourseByIdAction } from "@/lib/courses/actions";
import { requireAuth } from "@/lib/auth/auth";
import { getCourseDetailActionState } from "@/lib/courses/queries";

type CourseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const session = await requireAuth();
  const { id } = await params;
  const courseId = Number(id);

  if (!Number.isInteger(courseId)) {
    notFound();
  }

  const course = await getCourseByIdAction(courseId);
  const canEditCourse = session.user.userType === "ADMIN";
  const isEmployee = session.user.userType === "EMPLOYEE";
  const isManager = session.user.userType === "MANAGER";

  if (!course) {
    notFound();
  }

  const courseDetailActionState = await getCourseDetailActionState({
    courseId,
    userId: Number(session.user.id),
    userType: session.user.userType,
    organizationId: session.user.organizationId,
  });

  return (
    <article className="space-y-lg">
      <header className="space-y-sm">
        <div className="flex items-center justify-between gap-md">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
            Course
          </p>
          <div className="flex items-center gap-xs">
            {isEmployee ? (
              courseDetailActionState.employeeBookmark?.isAssigned ? (
                <EmployeeCourseOrgIndicator courseTitle={course.title} />
              ) : (
                <EmployeeCourseBookmarkButton
                  courseId={course.id}
                  courseTitle={course.title}
                  isBookmarked={
                    courseDetailActionState.employeeBookmark?.isBookmarked ??
                    false
                  }
                />
              )
            ) : null}
            {isManager && courseDetailActionState.managerOrganization ? (
              <ManagerCourseAssignButton
                courseId={course.id}
                courseTitle={course.title}
                organizationName={
                  courseDetailActionState.managerOrganization.name
                }
                isAssigned={
                  courseDetailActionState.managerOrganization.isAssigned
                }
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
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            {course.summary}
          </p>
        </div>
      </header>

      <CourseContentView content={course.content} />
    </article>
  );
}
