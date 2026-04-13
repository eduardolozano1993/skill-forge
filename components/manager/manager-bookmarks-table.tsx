"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

      <Dialog
        open={Boolean(selectedCourse)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCourse(null);
          }
        }}
      >
        {selectedCourse ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign course to organization?</DialogTitle>
              <DialogDescription>
                Are you sure you want to add{" "}
                <span className="font-medium text-text-strong">
                  {selectedCourse.courseTitle}
                </span>{" "}
                to{" "}
                <span className="font-medium text-text-strong">
                  {organizationName}
                </span>
                ?
              </DialogDescription>
              <DialogDescription>
                Confirming will delete this bookmark from all employees in the
                organization.
              </DialogDescription>
              {selectedCourseAlreadyAssigned ? (
                <DialogDescription>
                  The course is already assigned, so this will only clear the
                  bookmarks.
                </DialogDescription>
              ) : null}
            </DialogHeader>
            <DialogFooter>
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
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
