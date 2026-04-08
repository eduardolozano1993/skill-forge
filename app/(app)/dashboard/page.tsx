import { CourseCard } from "@/components/dashboard/course-card";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { NotificationItem } from "@/components/dashboard/notification-item";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { StatTile } from "@/components/dashboard/stat-tile";

const dashboardPreview = {
  course: {
    title: "Course card",
    summary: "Preview the card shell, spacing, and content hierarchy before wiring real course data.",
    progressLabel: "Empty state sample",
    durationLabel: "No schedule connected yet",
  },
  stat: {
    label: "Stat tile",
    value: "--",
    detail: "Use this for a single KPI once the dashboard metrics are ready.",
  },
  progress: {
    label: "Progress ring",
    value: 24,
    detail: "The visual can stay while the percentage later comes from live progress data.",
  },
  notification: {
    title: "Notification item",
    meta: "Preview content only",
    message: "This block is ready for reminders, alerts, or product updates once notifications are connected.",
  },
};

export default function DashboardPage() {
  return (
    <section className="space-y-xl">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Dashboard preview
        </p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">Empty containers</h1>
          <p className="mt-xs max-w-2xl text-base text-text-soft">
            Mock-heavy sections are removed. This page now shows one preview instance per reusable
            dashboard component.
          </p>
        </div>
      </header>

      <div className="grid gap-lg lg:grid-cols-2">
        <DashboardSection
          title="Course card"
          description="Single example for layout, typography, and metadata treatment."
        >
          <CourseCard {...dashboardPreview.course} />
        </DashboardSection>

        <DashboardSection
          title="Stat tile"
          description="Single metric block for validating the compact summary style."
        >
          <StatTile {...dashboardPreview.stat} />
        </DashboardSection>

        <DashboardSection
          title="Progress ring"
          description="Single progress visual to review proportion, spacing, and label placement."
        >
          <ProgressRing {...dashboardPreview.progress} />
        </DashboardSection>

        <DashboardSection
          title="Notification item"
          description="Single alert row for testing tone and message density."
        >
          <NotificationItem {...dashboardPreview.notification} />
        </DashboardSection>
      </div>
    </section>
  );
}
