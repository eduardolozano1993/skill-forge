import type { LucideIcon } from "lucide-react";
import { Award, BookMarked, Clock3, Flame, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  inProgressCourses,
  learnerMetrics,
  learnerProfile,
  recentActivity,
  upcomingSessions,
} from "@/lib/mock-data";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-sm">
        <CardDescription className="text-sm">{label}</CardDescription>
        <CardTitle className="font-heading text-3xl text-text-strong">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-soft">{detail}</p>
      </CardContent>
    </Card>
  );
}

type CoursePreviewCardProps = {
  title: string;
  progress: number;
  nextLesson: string;
  timeRemaining: string;
};

function CoursePreviewCard({
  title,
  progress,
  nextLesson,
  timeRemaining,
}: CoursePreviewCardProps) {
  return (
    <div className="space-y-sm rounded-md border border-border p-md">
      <div className="flex items-start justify-between gap-md">
        <div>
          <p className="font-medium text-text-strong">{title}</p>
          <p className="mt-xs text-sm text-text-soft">{nextLesson}</p>
        </div>
        <div className="rounded-full bg-surface-muted px-sm py-2xs text-xs font-medium text-text-soft">
          {timeRemaining}
        </div>
      </div>
      <div className="space-y-xs">
        <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs text-text-soft">
          <span>{progress}% complete</span>
          <span>Next lesson queued</span>
        </div>
      </div>
    </div>
  );
}

type FocusItemProps = {
  icon: LucideIcon;
  children: string;
};

function FocusItem({ icon: Icon, children }: FocusItemProps) {
  return (
    <div className="flex items-center gap-sm">
      <Icon className="size-4 text-brand" />
      {children}
    </div>
  );
}

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
            {learnerProfile.weeklyProgressHours} of {learnerProfile.weeklyGoalHours} hours this
            week
          </div>
        </div>
      </div>

      <div className="grid gap-lg sm:grid-cols-2 xl:grid-cols-3">
        {learnerMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid gap-lg xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardEyebrow>Current learning</CardEyebrow>
            <CardTitle className="font-heading text-text-strong">Courses in progress</CardTitle>
            <CardDescription>
              Current coursework with realistic milestones and time remaining.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-lg">
            {inProgressCourses.map((course) => (
              <CoursePreviewCard key={course.title} {...course} />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-lg">
          <Card>
            <CardHeader>
              <CardEyebrow>Momentum</CardEyebrow>
              <CardTitle className="font-heading text-text-strong">Focus snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-sm text-sm text-text-soft">
              <FocusItem icon={Flame}>Learning streak is holding steady this week.</FocusItem>
              <FocusItem icon={Clock3}>Best study window: 7:00 PM to 8:30 PM.</FocusItem>
              <FocusItem icon={Award}>One certificate is within reach this week.</FocusItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardEyebrow>Calendar</CardEyebrow>
              <CardTitle className="font-heading text-text-strong">Upcoming sessions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {upcomingSessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingSessions.map((session) => (
                      <TableRow key={session.title}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-text-strong">{session.title}</p>
                            <p className="mt-2xs text-xs text-text-soft">Hosted by {session.host}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-text-soft">{session.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <TableEmptyState
                  title="No sessions scheduled"
                  description="Upcoming coaching and critique sessions will show up here."
                  action={
                    <Button variant="outline" size="sm">
                      Browse sessions
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-lg xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardEyebrow>History</CardEyebrow>
            <CardTitle className="font-heading text-text-strong">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((item) => (
                  <TableRow key={`${item.title}-${item.when}`}>
                    <TableCell>
                      <div className="flex items-start gap-sm">
                        <div className="mt-1 rounded-full bg-brand-soft p-2xs text-brand-strong">
                          <BookMarked className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium text-text-strong">{item.title}</p>
                          <p className="mt-2xs text-sm text-text-soft">{item.detail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-text-soft">{item.when}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-md">
              <div className="space-y-xs">
                <CardEyebrow>Recommendation</CardEyebrow>
                <CardTitle className="font-heading text-text-strong">
                  Recommended next step
                </CardTitle>
              </div>
              <CardAction>
                <Button size="sm">Continue</Button>
              </CardAction>
            </div>
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
                Finish &ldquo;Leadership for Senior ICs&rdquo;
              </h2>
              <p className="mt-sm max-w-2xl text-base leading-7 text-text-soft">
                You are one short module away from completing this course. Finishing it
                this week will unlock the mentoring track and keep your streak intact.
              </p>
              <div className="mt-lg flex flex-wrap gap-sm text-sm text-text-soft">
                <span className="rounded-full bg-surface px-sm py-2xs">50m remaining</span>
                <span className="rounded-full bg-surface px-sm py-2xs">
                  Final reflection pending
                </span>
                <span className="rounded-full bg-surface px-sm py-2xs">
                  Certificate eligible
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
