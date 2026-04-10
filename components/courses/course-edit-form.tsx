"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useMockCourseOverrides } from "@/components/providers/mock-course-overrides-provider";
import { Button } from "@/components/ui/button";
import { getCourseContentText, type MockCourse } from "@/lib/mock-courses";
import { cn } from "@/lib/tailwind/utils";

type CourseEditFormProps = {
  course: MockCourse;
};

export function CourseEditForm({ course }: CourseEditFormProps) {
  const router = useRouter();
  const { overrides, setCourseContent } = useMockCourseOverrides();
  const initialContent = useMemo(
    () => overrides.get(course.id) ?? getCourseContentText(course),
    [course, overrides],
  );
  const [content, setContent] = useState(initialContent);

  const isDirty = content.trim() !== initialContent.trim();

  function handleCancel() {
    router.back();
  }

  function handleSave() {
    startTransition(() => {
      setCourseContent(course.id, content);
      router.back();
    });
  }

  return (
    <section className="mx-auto max-w-4xl px-lg py-3xl">
      <div className="space-y-lg rounded-lg border border-border bg-surface p-xl shadow-card">
        <div className="space-y-xs">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
            Admin
          </p>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            {course.title}
          </h1>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-strong">
            Course content
          </span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={14}
            className={cn(
              "min-h-80 w-full rounded-2xl border border-input bg-background px-md py-md text-sm leading-6 text-text-strong outline-none transition",
              "focus:border-brand focus:ring-2 focus:ring-[hsl(var(--brand)/0.2)]",
            )}
          />
        </label>

        <div className="flex justify-end gap-sm">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!isDirty}>
            Save
          </Button>
        </div>
      </div>
    </section>
  );
}
