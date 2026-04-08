import Link from "next/link";

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
  DashboardSectionErrorState,
  DashboardSectionHeader,
} from "@/components/dashboard/dashboard-section";
import { Button } from "@/components/ui/button";

type DashboardPreviewProps = {
  assignedCourses: DashboardCourse[] | null;
  recommendedCourses: DashboardCourse[] | null;
  favoriteCourses: DashboardCourse[] | null;
  recentActivity: DashboardActivity[] | null;
};

export function DashboardPreview({
  assignedCourses,
  recommendedCourses,
  favoriteCourses,
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
          {assignedCourses ? (
            <CourseList courses={assignedCourses} />
          ) : (
            <DashboardSectionErrorState
              title="Assigned courses unavailable"
              description="This section failed to load. The rest of the dashboard is still available."
              action={
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard">Retry section</Link>
                </Button>
              }
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Recommended courses"
          description="Same card system, different collection."
        />
        <DashboardSectionBody>
          {recommendedCourses ? (
            <CourseList courses={recommendedCourses} />
          ) : (
            <DashboardSectionErrorState
              title="Recommended courses unavailable"
              description="Recommendations could not be loaded right now."
              action={
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard">Retry section</Link>
                </Button>
              }
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Favorite courses"
          description="Saved courses you want to revisit quickly."
        />
        <DashboardSectionBody>
          {favoriteCourses && favoriteCourses.length > 0 ? (
            <CourseList courses={favoriteCourses} />
          ) : favoriteCourses ? (
            <DashboardSectionEmptyState
              title="No favorite courses yet"
              description="Courses you save for later will appear here."
            />
          ) : (
            <DashboardSectionErrorState
              title="Favorite courses unavailable"
              description="Favorite courses could not be loaded right now."
              action={
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard">Retry section</Link>
                </Button>
              }
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Recent activity"
          description="Repeatable activity items with a dedicated loading state."
        />
        <DashboardSectionBody>
          {recentActivity ? (
            <ActivityList items={recentActivity} />
          ) : (
            <DashboardSectionErrorState
              title="Recent activity unavailable"
              description="Activity updates could not be loaded right now."
              action={
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard">Retry section</Link>
                </Button>
              }
            />
          )}
        </DashboardSectionBody>
      </DashboardSection>
    </>
  );
}
