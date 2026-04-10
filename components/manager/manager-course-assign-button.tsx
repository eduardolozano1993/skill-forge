"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { assignCourseToOrganizationAction } from "@/lib/manager/actions";

type ManagerCourseAssignButtonProps = {
  courseId: number;
  courseTitle: string;
  organizationName: string;
  isAssigned: boolean;
};

export function ManagerCourseAssignButton({
  courseId,
  courseTitle,
  organizationName,
  isAssigned,
}: ManagerCourseAssignButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setIsSubmitting(true);

    const result = await assignCourseToOrganizationAction(courseId);

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setOpen(false);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label={
          isAssigned
            ? `${courseTitle} is already assigned to ${organizationName}`
            : `Add ${courseTitle} to ${organizationName}`
        }
        disabled={isAssigned}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className={`rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand)/0.35)] ${
          isAssigned
            ? "cursor-not-allowed text-brand"
            : "text-text-soft hover:bg-brand-soft hover:text-brand"
        }`}
      >
        <Building2 className="size-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-strong/20 p-md">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-lg shadow-card">
            <div className="space-y-xs">
              <h2 className="font-heading text-xl text-text-strong">
                Add course to organization?
              </h2>
              <p className="text-sm text-text-soft">
                Are you sure you want to add{" "}
                <span className="font-medium text-text-strong">
                  {courseTitle}
                </span>{" "}
                to{" "}
                <span className="font-medium text-text-strong">
                  {organizationName}
                </span>
                ?
              </p>
              {error ? (
                <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-md py-sm text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </div>
            <div className="mt-lg flex justify-end gap-sm">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirm}
              >
                {isSubmitting ? "Adding..." : "Accept"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
