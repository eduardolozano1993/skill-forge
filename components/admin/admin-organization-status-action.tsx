"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, LockOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateAdminOrganizationStatusAction } from "@/lib/admin/actions";
import type { AdminOrganizationStatus } from "@/lib/admin/types";

type AdminOrganizationStatusActionProps = {
  organizationId: number;
  name: string;
  status: AdminOrganizationStatus;
};

export function AdminOrganizationStatusAction({
  organizationId,
  name,
  status,
}: AdminOrganizationStatusActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDeactivated = status === "DEACTIVATED";
  const nextStatus: AdminOrganizationStatus = isDeactivated
    ? "ACTIVE"
    : "DEACTIVATED";

  async function handleConfirm() {
    setError(null);
    setIsSubmitting(true);

    const result = await updateAdminOrganizationStatusAction(
      organizationId,
      nextStatus,
    );

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
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className={`inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand)/0.35)] ${
          isDeactivated
            ? "size-10 text-emerald-700 hover:bg-emerald-50"
            : "gap-2 bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
        }`}
        aria-label={
          isDeactivated
            ? `Reactivate ${name}`
            : `Deactivate ${name}`
        }
      >
        {isDeactivated ? <LockOpen className="size-4" /> : <Ban className="size-4" />}
      </button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDeactivated ? "Activate organization?" : "Deactivate organization?"}
          </DialogTitle>
          <DialogDescription>
            {isDeactivated ? (
              <>
                Are you sure you want to reactivate{" "}
                <span className="font-medium text-text-strong">{name}</span>?
              </>
            ) : (
              <>
                Are you sure you want to deactivate{" "}
                <span className="font-medium text-text-strong">{name}</span>?
              </>
            )}
          </DialogDescription>
          <DialogDescription>
            {isDeactivated
              ? "The organization and its currently assigned users will be activated again."
              : "The organization will keep all of its records, but its currently assigned users will be deactivated until the organization is activated again."}
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
