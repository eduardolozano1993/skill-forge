import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AppCourse } from "@/lib/courses/temp/types";

type DashboardBookmarkDialogProps = {
  course: AppCourse | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DashboardBookmarkDialog({
  course,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: DashboardBookmarkDialogProps) {
  if (!course) {
    return null;
  }

  return (
    <Dialog open onOpenChange={(open) => (!open ? onCancel() : undefined)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove bookmarked course?</DialogTitle>
          <DialogDescription>
            Remove{" "}
            <span className="font-medium text-text-strong">{course.name}</span>{" "}
            from your bookmarked courses?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Removing..." : "Ok"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
