"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";

import { toggleCourseBookmarkAction } from "@/lib/courses/actions";

type EmployeeCourseBookmarkButtonProps = {
  courseId: number;
  courseName: string;
  isBookmarked: boolean;
};

export function EmployeeCourseBookmarkButton({
  courseId,
  courseName,
  isBookmarked,
}: EmployeeCourseBookmarkButtonProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleToggle() {
    setIsSubmitting(true);
    setBookmarked((current) => !current);

    const result = await toggleCourseBookmarkAction(courseId);

    setIsSubmitting(false);

    if (result?.error) {
      setBookmarked((current) => !current);
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isSubmitting}
      aria-label={
        bookmarked
          ? `Remove bookmark for ${courseName}`
          : `Bookmark ${courseName}`
      }
      title={bookmarked ? "Remove bookmark" : "Bookmark this course"}
      onClick={handleToggle}
      className="rounded-full p-2 text-amber-400 transition-colors hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand)/0.35)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Bookmark
        className="size-5"
        fill={bookmarked ? "currentColor" : "none"}
      />
    </button>
  );
}
