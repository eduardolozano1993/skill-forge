"use client";

import { startTransition, useState } from "react";
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
import { removeAssignedCourseFromOrganizationAction } from "@/lib/manager/actions";
import { ManagerAssignedCourseSummary } from "@/lib/manager/queries";

type ManagerAssignedCoursesTableProps = {
  courses: ManagerAssignedCourseSummary[];
};

function formatCompletionRate(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

export function ManagerAssignedCoursesTable({
  courses,
}: ManagerAssignedCoursesTableProps) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] =
    useState<ManagerAssignedCourseSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!selectedCourse) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await removeAssignedCourseFromOrganizationAction(
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
            <TableHead>Completion status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell className="font-medium text-text-strong">
                {course.courseName}
              </TableCell>
              <TableCell className="text-text-soft">
                {course.completedEmployees}/{course.totalEmployees} (
                {formatCompletionRate(course.completionRate)})
              </TableCell>
              <TableCell className="w-[30%]">
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setError(null);
                    setSelectedCourse(course);
                  }}
                >
                  Remove
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
              <DialogTitle>Remove assigned course?</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove{" "}
                <span className="font-medium text-text-strong">
                  {selectedCourse.courseName}
                </span>{" "}
                from the organization?
              </DialogDescription>
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
                variant="destructive"
                disabled={isSubmitting}
                onClick={handleConfirm}
              >
                {isSubmitting ? "Removing..." : "Remove"}
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
