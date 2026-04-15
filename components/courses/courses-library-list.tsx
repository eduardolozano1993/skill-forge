"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { CourseList } from "@/components/dashboard/course-list";
import { toggleCourseBookmarkAction } from "@/lib/courses/actions";
import type { AppCourse } from "@/lib/courses/temp/types";

type CoursesLibraryListProps = {
  courses: AppCourse[];
  bookmarkedCourseIds: number[];
  completedCourseIds: number[];
  userType: "ADMIN" | "MANAGER" | "EMPLOYEE";
};

export function CoursesLibraryList({
  courses,
  bookmarkedCourseIds,
  completedCourseIds,
  userType,
}: CoursesLibraryListProps) {
  const router = useRouter();
  const [bookmarkIds, setBookmarkIds] = useState<Set<number>>(
    () => new Set(bookmarkedCourseIds),
  );
  const [completionIds] = useState<Set<number>>(
    () => new Set(completedCourseIds),
  );
  const [pendingCourseIds, setPendingCourseIds] = useState<Set<number>>(
    () => new Set(),
  );

  function updatePendingCourse(courseId: number, isPending: boolean) {
    setPendingCourseIds((current) => {
      const next = new Set(current);

      if (isPending) {
        next.add(courseId);
      } else {
        next.delete(courseId);
      }

      return next;
    });
  }

  async function handleBookmarkToggle(course: AppCourse) {
    if (userType !== "EMPLOYEE") {
      return;
    }

    setBookmarkIds((current) => {
      const next = new Set(current);

      if (next.has(course.id)) {
        next.delete(course.id);
      } else {
        next.add(course.id);
      }

      return next;
    });
    updatePendingCourse(course.id, true);

    const result = await toggleCourseBookmarkAction(course.id);

    updatePendingCourse(course.id, false);

    if (result?.error) {
      setBookmarkIds((current) => {
        const next = new Set(current);

        if (next.has(course.id)) {
          next.delete(course.id);
        } else {
          next.add(course.id);
        }

        return next;
      });
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <CourseList
      courses={courses}
      bookmarkedCourseIds={bookmarkIds}
      completedCourseIds={completionIds}
      pendingCourseIds={pendingCourseIds}
      onBookmarkToggle={
        userType === "EMPLOYEE" ? handleBookmarkToggle : undefined
      }
    />
  );
}
