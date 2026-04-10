import { Button } from "@/components/ui/button";
import type { AppCourse } from "@/lib/courses/types";

type DashboardBookmarkDialogProps = {
  course: AppCourse | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DashboardBookmarkDialog({
  course,
  onCancel,
  onConfirm,
}: DashboardBookmarkDialogProps) {
  if (!course) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-strong/20 p-md">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-lg shadow-card">
        <div className="space-y-xs">
          <h2 className="font-heading text-xl text-text-strong">Remove bookmarked course?</h2>
          <p className="text-sm text-text-soft">
            Remove <span className="font-medium text-text-strong">{course.title}</span> from your
            bookmarked courses?
          </p>
        </div>
        <div className="mt-lg flex justify-end gap-sm">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Ok</Button>
        </div>
      </div>
    </div>
  );
}
