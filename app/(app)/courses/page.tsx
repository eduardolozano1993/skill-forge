import { CourseList } from "@/components/dashboard/course-list";
import { getCourses } from "@/lib/mock-courses";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="space-y-lg">
      <header className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Courses</p>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-text-strong">
            Course library
          </h1>
          <p className="mt-xs max-w-3xl text-base text-text-soft">
            Browse the full mock catalog that powers assigned and recommended learning on the
            dashboard.
          </p>
        </div>
      </header>
      <CourseList courses={courses} />
    </section>
  );
}
