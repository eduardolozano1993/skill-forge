import { CourseList } from "@/components/dashboard/course-list";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionHeader,
} from "@/components/dashboard/dashboard-section";

function DashboardCourseSectionSkeleton({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <DashboardSection>
      <DashboardSectionHeader title={title} description={description} />
      <DashboardSectionBody>
        <CourseList courses={[]} isLoading />
      </DashboardSectionBody>
    </DashboardSection>
  );
}

export function DashboardCourseCollectionsFallback() {
  return (
    <>
      <DashboardCourseSectionSkeleton
        title="Assigned courses"
        description="Repeatable compact cards with stable ids from the mock data file."
      />
      <DashboardCourseSectionSkeleton
        title="Recommended courses"
        description="Same card system, different collection."
      />
      <DashboardCourseSectionSkeleton
        title="Bookmarked courses"
        description="Saved courses you want to revisit quickly."
      />
      <DashboardCourseSectionSkeleton
        title="Completed courses"
        description="Courses you have marked as completed across your dashboard."
      />
    </>
  );
}
