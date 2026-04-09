"use client";

import { getCourseContentParagraphs, getCourseContentText, type MockCourse } from "@/lib/mock-courses";
import { useMockCourseOverrides } from "@/components/providers/mock-course-overrides-provider";

type CourseContentViewProps = {
  course: MockCourse;
};

export function CourseContentView({ course }: CourseContentViewProps) {
  const { overrides } = useMockCourseOverrides();
  const content = overrides.get(course.id) ?? getCourseContentText(course);
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
