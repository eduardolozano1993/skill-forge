"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { assignBookmarkedCourseToOrganizationAction } from "@/lib/manager/actions";
import type { ManagerBookmarkedCourseSummary } from "@/lib/manager/data";

type ManagerBookmarksTableProps = {
  courses: ManagerBookmarkedCourseSummary[];
  organizationName: string;
};

export function ManagerBookmarksTable({
  courses,
  organizationName,
}: ManagerBookmarksTableProps) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] =
    useState<ManagerBookmarkedCourseSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedCourseAlreadyAssigned = useMemo(
    () => Boolean(selectedCourse?.isAssigned),
    [selectedCourse],
  );

  async function handleConfirm() {
    if (!selectedCourse) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await assignBookmarkedCourseToOrganizationAction(
      selectedCourse.courseId,
    );

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSelectedCourse(null);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-md py-sm text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Table>
        <colgroup>
          <col className="w-[40%]" />
          <col className="w-[30%]" />
          <col className="w-[30%]" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell className="font-medium text-text-strong">
                {course.courseTitle}
              </TableCell>
              <TableCell className="text-text-soft">
                {course.employeeCount}
              </TableCell>
              <TableCell className="w-[30%]">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    setSelectedCourse(course);
                  }}
                >
                  Assign
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCourse ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-strong/20 p-md">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-lg shadow-card">
            <div className="space-y-xs">
              <h2 className="font-heading text-xl text-text-strong">
                Assign course to organization?
              </h2>
              <p className="text-sm text-text-soft">
                Are you sure you want to add{" "}
                <span className="font-medium text-text-strong">
                  {selectedCourse.courseTitle}
                </span>{" "}
                to{" "}
                <span className="font-medium text-text-strong">
                  {organizationName}
                </span>
                ?
              </p>
              <br />
              <p className="text-sm text-text-soft">
                Confirming will delete this bookmark from all employees in the
                organization.
                <br />
                <br />
                {selectedCourseAlreadyAssigned
                  ? "The course is already assigned, so this will only clear the bookmarks."
                  : ""}
              </p>
            </div>
            <div className="mt-lg flex justify-end gap-sm">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setSelectedCourse(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirm}
              >
                {isSubmitting ? "Applying..." : "Accept"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
