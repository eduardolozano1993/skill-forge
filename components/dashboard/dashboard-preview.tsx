import {
  type DashboardActivity,
  type DashboardCourse,
} from "@/app/(app)/dashboard/mock-data";
import { ActivityList } from "@/components/dashboard/activity-list";
import { CourseList } from "@/components/dashboard/course-list";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionEmptyState,
  DashboardSectionHeader,
} from "@/components/dashboard/dashboard-section";
import { Button } from "@/components/ui/button";

type DashboardPreviewProps = {
  assignedCourses: DashboardCourse[];
  recommendedCourses: DashboardCourse[];
  recentActivity: DashboardActivity[];
};

export function DashboardPreview({
  assignedCourses,
  recommendedCourses,
  recentActivity,
}: DashboardPreviewProps) {
  return (
    <>
      <DashboardSection>
        <DashboardSectionHeader
          title="Assigned courses"
          description="Repeatable compact cards with stable ids from the mock data file."
          action={<Button size="sm" variant="subtle">View all</Button>}
        />
        <DashboardSectionBody>
          <CourseList courses={assignedCourses} />
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Recommended courses"
          description="Same card system, different collection."
        />
        <DashboardSectionBody>
          <CourseList courses={recommendedCourses} />
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Recent activity"
          description="Repeatable activity items with a dedicated loading state."
        />
        <DashboardSectionBody>
          {recentActivity.length > 0 ? (
            <ActivityList items={recentActivity} />
          ) : (
            <DashboardSectionEmptyState
              title="No activity yet"
              description="New dashboard activity will appear here once the real data source is connected."
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>
    </>
  );
}
