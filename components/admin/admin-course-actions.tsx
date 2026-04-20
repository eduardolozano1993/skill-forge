"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, LockOpen, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateAdminCourseStatusAction } from "@/lib/admin/actions";
import type { AdminCourseStatus } from "@/lib/admin/types";

type AdminCourseActionsProps = {
  courseId: number;
  title: string;
  status: AdminCourseStatus;
};

export function AdminCourseActions({
  courseId,
  title,
  status,
}: AdminCourseActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDeactivated = status === "DEACTIVATED";
  const nextStatus: AdminCourseStatus = isDeactivated ? "ACTIVE" : "DEACTIVATED";

  async function handleConfirm() {
    setError(null);
    setIsSubmitting(true);

    const result = await updateAdminCourseStatusAction(courseId, nextStatus);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setOpen(false);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setError(null);
        }
        setOpen(nextOpen);
      }}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-yellow-300 text-yellow-950 hover:bg-yellow-400"
          asChild
        >
          <Link
            href={`/admin/courses/${courseId}/edit`}
            aria-label={`Edit ${title}`}
          >
            <Pencil className="size-4" />
          </Link>
        </Button>
        <Button
          type="button"
          variant={isDeactivated ? "outline" : "destructive"}
          size="icon"
          onClick={() => {
            setError(null);
            setOpen(true);
          }}
          aria-label={
            isDeactivated ? `Activate ${title}` : `Deactivate ${title}`
          }
        >
          {isDeactivated ? (
            <LockOpen className="size-4" />
          ) : (
            <Ban className="size-4" />
          )}
        </Button>
      </div>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDeactivated ? "Activate course?" : "Deactivate course?"}
          </DialogTitle>
          <DialogDescription>
            {isDeactivated ? (
              <>
                Are you sure you want to reactivate{" "}
                <span className="font-medium text-text-strong">{title}</span>?
              </>
            ) : (
              <>
                Are you sure you want to deactivate{" "}
                <span className="font-medium text-text-strong">{title}</span>?
              </>
            )}
          </DialogDescription>
          <DialogDescription>
            {isDeactivated
              ? "The course will appear in the course catalog and search results again."
              : "The course will stay available in admin, but it will be removed from the course catalog and search results until it is activated again."}
          </DialogDescription>
          {error ? (
            <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-md py-sm text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" disabled={isSubmitting} onClick={handleConfirm}>
            {isSubmitting
              ? isDeactivated
                ? "Activating..."
                : "Deactivating..."
              : isDeactivated
                ? "Activate"
                : "Deactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
