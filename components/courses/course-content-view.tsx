"use client";

type CourseContentViewProps = {
  content: string;
};

export function CourseContentView({ content }: CourseContentViewProps) {
  return (
    <div className="space-y-md">
      <p className="max-w-3xl text-base leading-7 text-text-soft">{content}</p>
    </div>
  );
}
