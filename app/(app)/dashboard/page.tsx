import { Award, BookMarked, Clock3, Flame, PlayCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  inProgressCourses,
  learnerMetrics,
  learnerProfile,
  recentActivity,
  upcomingSessions,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <section className="space-y-xl">
      <div className="flex flex-col gap-md lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-sm">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
            Welcome back
          </p>
          <div>
            <h1 className="font-heading text-3xl font-semibold text-text-strong">
              {learnerProfile.name}
            </h1>
            <p className="mt-xs text-base text-text-soft">{learnerProfile.role}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-sm">
          <div className="rounded-md bg-brand-soft px-md py-sm text-sm text-brand-strong">
            <span className="font-semibold">{learnerProfile.streakDays}-day streak</span>
          </div>
          <div className="rounded-md bg-surface-muted px-md py-sm text-sm text-text-soft">
            {learnerProfile.weeklyProgressHours} of {learnerProfile.weeklyGoalHours} hours this week
          </div>
        </div>
      </div>

      <div className="grid gap-lg md:grid-cols-3">
        {learnerMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-sm">
              <CardDescription className="text-sm">{metric.label}</CardDescription>
              <CardTitle className="font-heading text-3xl text-text-strong">
                {metric.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-soft">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-lg xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-text-strong">Courses in progress</CardTitle>
            <CardDescription>
              Current coursework with realistic milestones and time remaining.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-lg">
            {inProgressCourses.map((course) => (
              <div key={course.title} className="space-y-sm rounded-md border border-border p-md">
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <p className="font-medium text-text-strong">{course.title}</p>
                    <p className="mt-xs text-sm text-text-soft">{course.nextLesson}</p>
                  </div>
                  <div className="rounded-full bg-surface-muted px-sm py-2xs text-xs font-medium text-text-soft">
                    {course.timeRemaining}
                  </div>
                </div>
                <div className="space-y-xs">
                  <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-soft">
                    <span>{course.progress}% complete</span>
                    <span>Next lesson queued</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-lg">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-text-strong">Focus snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-sm text-sm text-text-soft">
              <div className="flex items-center gap-sm">
                <Flame className="size-4 text-brand" />
                Learning streak is holding steady this week.
              </div>
              <div className="flex items-center gap-sm">
                <Clock3 className="size-4 text-brand" />
                Best study window: 7:00 PM to 8:30 PM.
              </div>
              <div className="flex items-center gap-sm">
                <Award className="size-4 text-brand" />
                One certificate is within reach this week.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-text-strong">Upcoming sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-md">
              {upcomingSessions.map((session) => (
                <div key={session.title} className="rounded-md bg-surface-muted p-md">
                  <p className="font-medium text-text-strong">{session.title}</p>
                  <p className="mt-xs text-sm text-text-soft">{session.time}</p>
                  <p className="mt-2xs text-sm text-text-soft">Hosted by {session.host}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-lg xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-text-strong">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-md">
            {recentActivity.map((item) => (
              <div key={item.title + item.when} className="flex gap-sm">
                <div className="mt-1 rounded-full bg-brand-soft p-2xs text-brand-strong">
                  <BookMarked className="size-4" />
                </div>
                <div>
                  <p className="font-medium text-text-strong">{item.title}</p>
                  <p className="mt-2xs text-sm text-text-soft">{item.detail}</p>
                  <p className="mt-2xs text-xs text-text-soft">{item.when}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-text-strong">Recommended next step</CardTitle>
            <CardDescription>
              Based on current progress across active coursework.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border bg-surface-muted p-lg">
              <div className="flex items-center gap-sm text-brand">
                <PlayCircle className="size-5" />
                <span className="text-sm font-medium uppercase tracking-[0.12em]">
                  Resume learning
                </span>
              </div>
              <h2 className="mt-md font-heading text-2xl font-semibold text-text-strong">
                Finish “Leadership for Senior ICs”
              </h2>
              <p className="mt-sm max-w-2xl text-base leading-7 text-text-soft">
                You are one short module away from completing this course. Finishing it
                this week will unlock the mentoring track and keep your streak intact.
              </p>
              <div className="mt-lg flex flex-wrap gap-sm text-sm text-text-soft">
                <span className="rounded-full bg-surface px-sm py-2xs">50m remaining</span>
                <span className="rounded-full bg-surface px-sm py-2xs">Final reflection pending</span>
                <span className="rounded-full bg-surface px-sm py-2xs">Certificate eligible</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
