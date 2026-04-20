"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import type { CourseEditLockState } from "@/lib/courses/edit-lock";
import {
  refreshCourseEditLockAction,
  releaseCourseEditLockAction,
  updateCourseContentAction,
  type UpdateCourseContentState,
} from "@/lib/courses/actions";
import type { CourseDetail } from "@/lib/courses/types";
import { cn } from "@/lib/utils/tailwind/tailwind";
import { Button } from "@/components/ui/button";

type CourseEditFormProps = {
  course: CourseDetail;
  initialLockState: CourseEditLockState;
};

const initialState: UpdateCourseContentState = {};

export function CourseEditForm({
  course,
  initialLockState,
}: CourseEditFormProps) {
  const router = useRouter();
  const initialContent = course.content;
  const [content, setContent] = useState(initialContent);
  const [lockState, setLockState] = useState(initialLockState);
  const [lockRefreshError, setLockRefreshError] = useState<string | null>(null);
  const [state, formAction] = useActionState(
    updateCourseContentAction,
    initialState,
  );

  const isDirty = content.trim() !== initialContent.trim();
  const lockIsOwnedByCurrentAdmin = lockState.status === "acquired";

  function handleCancel() {
    void releaseCourseEditLockAction(course.id);
    router.back();
  }

  useEffect(() => {
    if (!lockIsOwnedByCurrentAdmin) {
      return;
    }

    const intervalId = window.setInterval(async () => {
      const result = await refreshCourseEditLockAction(course.id);

      if (!result.success) {
        setLockState({
          status: "conflict",
          holderUserId: null,
          expiresInSeconds: 0,
        });
        setLockRefreshError(
          "Your course edit lock expired. Refresh the page before saving again.",
        );
      }
    }, 45_000);

    return () => {
      window.clearInterval(intervalId);
      void releaseCourseEditLockAction(course.id);
    };
  }, [course.id, lockIsOwnedByCurrentAdmin]);

  return (
    <form action={formAction} className="space-y-md">
      <h1 className="font-heading text-3xl font-semibold text-text-strong pb-lg">
        {course.name}
      </h1>

      {!lockIsOwnedByCurrentAdmin ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-md py-sm text-sm text-destructive">
          Another admin is already editing this course. Saving is disabled until
          that lock expires
          {lockState.expiresInSeconds > 0
            ? ` in about ${lockState.expiresInSeconds} seconds.`
            : "."}
        </p>
      ) : null}

      {lockRefreshError ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-md py-sm text-sm text-destructive">
          {lockRefreshError}
        </p>
      ) : null}

      {state.error ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-md py-sm text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <input type="hidden" name="courseId" value={course.id} />
      <input
        type="hidden"
        name="contentVersion"
        value={course.contentVersion}
      />

      <label className="block space-y-2">
        <textarea
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={14}
          disabled={!lockIsOwnedByCurrentAdmin}
          className={cn(
            "min-h-80 w-full rounded-2xl border border-input bg-background px-md py-md text-sm leading-6 text-text-strong outline-none transition",
            "focus:border-brand focus:ring-2 focus:ring-[hsl(var(--brand)/0.2)] disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
      </label>

      <div className="flex justify-end gap-sm pt-lg">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <SubmitButton disabled={!isDirty || !lockIsOwnedByCurrentAdmin} />
      </div>
    </form>
  );
}

type SubmitButtonProps = {
  disabled: boolean;
};

function SubmitButton({ disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
