"use client";

import { getCourseContentParagraphs } from "@/lib/courses/utils";

type CourseContentViewProps = {
  content: string;
};

export function CourseContentView({ content }: CourseContentViewProps) {
  const paragraphs = getCourseContentParagraphs(content);

  return (
    <div className="space-y-md">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="max-w-3xl text-base leading-7 text-text-soft">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
