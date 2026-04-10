import Link from "next/link";
import type { ReactNode } from "react";

import { CourseList } from "@/components/dashboard/course-list";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionEmptyState,
  DashboardSectionErrorState,
  DashboardSectionHeader,
} from "@/components/dashboard/dashboard-section";
import { Button } from "@/components/ui/button";
import type { AppCourse } from "@/lib/courses/types";

type DashboardCourseSectionProps = {
  title: string;
  description: string;
  courses: AppCourse[] | null;
  emptyTitle: string;
  emptyDescription: string;
  errorTitle: string;
  errorDescription: string;
  bookmarkedCourseIds: Set<number>;
  completedCourseIds: Set<number>;
  pendingCourseIds?: Set<number>;
  onBookmarkToggle: (course: AppCourse) => void;
  onCompletedToggle: (course: AppCourse) => void;
  action?: ReactNode;
  progress?: {
    completed: number;
    total: number;
  };
};

export function DashboardCourseSection({
  title,
  description,
  courses,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  bookmarkedCourseIds,
  completedCourseIds,
  pendingCourseIds,
  onBookmarkToggle,
  onCompletedToggle,
  action,
  progress,
}: DashboardCourseSectionProps) {
  return (
    <DashboardSection>
      <DashboardSectionHeader
        title={
          progress ? (
            <div className="flex items-center gap-sm">
              <span>{title}</span>
              <span className="text-sm font-medium text-text-soft">
                {progress.completed}/{progress.total}
              </span>
            </div>
          ) : (
            title
          )
        }
        description={description}
        action={action}
      />
      <DashboardSectionBody>
        {courses ? (
          courses.length > 0 ? (
            <CourseList
              courses={courses}
              bookmarkedCourseIds={bookmarkedCourseIds}
              completedCourseIds={completedCourseIds}
              pendingCourseIds={pendingCourseIds}
              onBookmarkToggle={onBookmarkToggle}
              onCompletedToggle={onCompletedToggle}
            />
          ) : (
            <DashboardSectionEmptyState
              title={emptyTitle}
              description={emptyDescription}
            />
          )
        ) : (
          <DashboardSectionErrorState
            title={errorTitle}
            description={errorDescription}
            action={
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard">Retry section</Link>
              </Button>
            }
          />
        )}
      </DashboardSectionBody>
    </DashboardSection>
  );
}
