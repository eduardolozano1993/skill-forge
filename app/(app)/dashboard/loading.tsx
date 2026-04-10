import { CourseList } from "@/components/dashboard/course-list";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionHeader,
} from "@/components/dashboard/dashboard-section";

export default function DashboardLoading() {
  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Dashboard</p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">Loading dashboard</h1>
          <p className="mt-xs max-w-2xl text-base text-text-soft">
            Course collections are rendering their loading state.
          </p>
        </div>
      </header>

      <DashboardSection>
        <DashboardSectionHeader
          title="Assigned courses"
          description="Courses assigned to your organization."
        />
        <DashboardSectionBody>
          <CourseList courses={[]} isLoading />
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Bookmarked courses"
          description="Saved courses you want to revisit quickly."
        />
        <DashboardSectionBody>
          <CourseList courses={[]} isLoading />
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Completed courses"
          description="Courses you have marked as completed across your dashboard."
        />
        <DashboardSectionBody>
          <CourseList courses={[]} isLoading />
        </DashboardSectionBody>
      </DashboardSection>
    </section>
  );
}
