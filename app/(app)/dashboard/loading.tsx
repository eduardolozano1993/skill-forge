import { ActivityList } from "@/components/dashboard/activity-list";
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
            Course lists and activity blocks are rendering their loading state.
          </p>
        </div>
      </header>

      <DashboardSection>
        <DashboardSectionHeader
          title="Assigned courses"
          description="Compact list layout with repeatable course cards."
        />
        <DashboardSectionBody>
          <CourseList courses={[]} isLoading />
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Recommended courses"
          description="Same list UI, separate data source."
        />
        <DashboardSectionBody>
          <CourseList courses={[]} isLoading />
        </DashboardSectionBody>
      </DashboardSection>

      <DashboardSection>
        <DashboardSectionHeader
          title="Recent activity"
          description="Activity feed placeholder with stable spacing."
        />
        <DashboardSectionBody>
          <ActivityList items={[]} isLoading />
        </DashboardSectionBody>
      </DashboardSection>
    </section>
  );
}
