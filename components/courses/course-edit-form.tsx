"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateCourseContentAction } from "@/lib/courses/temp/actions";
import type { CourseDetail } from "@/lib/courses/temp/types";
import { cn } from "@/lib/tailwind/utils";
import { Button } from "@/components/ui/button";

type CourseEditFormProps = {
  course: CourseDetail;
};

export function CourseEditForm({ course }: CourseEditFormProps) {
  const router = useRouter();
  const initialContent = course.content;
  const [content, setContent] = useState(initialContent);

  const isDirty = content.trim() !== initialContent.trim();

  function handleCancel() {
    router.back();
  }

  return (
    <form action={updateCourseContentAction} className="">
      <h1 className="font-heading text-3xl font-semibold text-text-strong pb-lg">
        {course.name}
      </h1>

      <input type="hidden" name="courseId" value={course.id} />

      <label className="block space-y-2">
        <textarea
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={14}
          className={cn(
            "min-h-80 w-full rounded-2xl border border-input bg-background px-md py-md text-sm leading-6 text-text-strong outline-none transition",
            "focus:border-brand focus:ring-2 focus:ring-[hsl(var(--brand)/0.2)]",
          )}
        />
      </label>

      <div className="flex justify-end gap-sm pt-lg">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty}>
          Save
        </Button>
      </div>
    </form>
  );
}
