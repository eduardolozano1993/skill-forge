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
import { updateAdminUserStatusAction } from "@/lib/admin/actions";
import type { AdminUserStatus } from "@/lib/admin/types";

type AdminUserStatusActionProps = {
  userId: number;
  name: string;
  status: AdminUserStatus;
  userType: "ADMIN" | "MANAGER" | "EMPLOYEE";
};

export function AdminUserStatusAction({
  userId,
  name,
  status,
  userType,
}: AdminUserStatusActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (userType === "ADMIN") {
    return <span className="text-sm text-text-soft">N/A</span>;
  }

  const isDeactivated = status === "DEACTIVATED";
  const nextStatus: AdminUserStatus = isDeactivated ? "ACTIVE" : "DEACTIVATED";

  async function handleConfirm() {
    setError(null);
    setIsSubmitting(true);

    const result = await updateAdminUserStatusAction(userId, nextStatus);

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
        aria-label={isDeactivated ? `Reactivate ${name}` : `Deactivate ${name}`}
      >
        {isDeactivated ? (
          <LockOpen className="size-4" />
        ) : (
          <>
            <Ban className="size-4" />
          </>
        )}
      </button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDeactivated ? "Activate user?" : "Deactivate user?"}
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
              ? "The user will be able to sign in again after activation."
              : "The user will keep their data, but new sign-in attempts will be blocked until the account is activated again."}
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
