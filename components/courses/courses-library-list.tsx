"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

import { CourseList } from "@/components/dashboard/course-list";
import { Pagination } from "@/components/ui/pagination";
import type { CourseDetail } from "@/lib/courses/types";
import type { TablePagination } from "@/lib/table/types";
import {
  toggleCourseBookmarkAction,
  toggleCourseCompletionAction,
} from "@/lib/courses/actions";

type CoursesLibraryListProps = {
  courses: CourseDetail[];
  userType: "ADMIN" | "MANAGER" | "EMPLOYEE";
  pagination?: TablePagination;
  search: string;
};

export function CoursesLibraryList({
  courses,
  userType,
  pagination,
  search,
}: CoursesLibraryListProps) {
  const router = useRouter();

  async function handleBookmarkToggle(course: CourseDetail) {
    if (userType !== "EMPLOYEE") {
      return;
    }

    await toggleCourseBookmarkAction(course.id);

    startTransition(() => {
      router.refresh();
    });
  }

  async function handleCompletedToggle(course: CourseDetail) {
    if (userType !== "EMPLOYEE") {
      return;
    }

    await toggleCourseCompletionAction(course.id);

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="space-y-md">
      {pagination ? (
        <div className="flex flex-col gap-2 text-sm text-text-soft md:flex-row md:items-center md:justify-between">
          <p>
            Showing {(pagination.page - 1) * pagination.pageSize + 1}
            {" - "}
            {Math.min(
              pagination.page * pagination.pageSize,
              pagination.totalRows,
            )}{" "}
            of {pagination.totalRows} courses
          </p>
          <p>
            {pagination.totalRows === 1
              ? "1 result"
              : `${pagination.totalRows} results`}
          </p>
        </div>
      ) : null}

      <CourseList
        courses={courses}
        showBookmarkAction={userType === "EMPLOYEE"}
        showCompletedAction={userType === "EMPLOYEE"}
        onBookmarkToggle={handleBookmarkToggle}
        onCompletedToggle={handleCompletedToggle}
      />

      {pagination ? (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pathname="/courses"
          searchParams={{
            q: search || undefined,
          }}
        />
      ) : null}
    </div>
  );
}
