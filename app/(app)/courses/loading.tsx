import { CourseList } from "@/components/dashboard/course-list";
import {
  DashboardSection,
  DashboardSectionBody,
  DashboardSectionHeader,
} from "@/components/dashboard/dashboard-section";

export default function CoursesLoading() {
  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Courses</p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">Loading courses</h1>
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            The shared course catalog is rendering its loading state.
          </p>
        </div>
      </header>

      <DashboardSection>
        <DashboardSectionHeader
          title="All courses"
          description="Shared mock course cards for the catalog route."
        />
        <DashboardSectionBody>
          <CourseList courses={[]} isLoading />
        </DashboardSectionBody>
      </DashboardSection>
    </section>
  );
}
