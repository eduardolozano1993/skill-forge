import { getDashboardMockData } from "@/app/(app)/dashboard/mock-data";
import { DashboardPreview } from "@/components/dashboard/dashboard-preview";

export default async function DashboardPage() {
  const { assignedCourses, recommendedCourses, recentActivity } = await getDashboardMockData();

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Dashboard</p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">Collection preview</h1>
          <p className="mt-xs max-w-2xl text-base text-text-soft">
            All dashboard sample content is sourced from a separate mock file so this page can stay
            free of hardcoded data when you swap in the real database.
          </p>
        </div>
      </header>
      <DashboardPreview
        assignedCourses={assignedCourses}
        recommendedCourses={recommendedCourses}
        recentActivity={recentActivity}
      />
    </section>
  );
}
