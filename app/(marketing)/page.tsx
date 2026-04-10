import Link from "next/link";
import { ArrowRight, BookOpen, Compass, GraduationCap, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { featuredPrograms, landingStats, testimonials } from "@/lib/mock-data";

const pillars = [
  {
    icon: GraduationCap,
    title: "Structured paths",
    description: "Guided programs for engineering depth, delivery habits, and leadership growth.",
  },
  {
    icon: Compass,
    title: "Clear momentum",
    description: "Weekly goals, milestones, and check-ins make progress visible without noise.",
  },
  {
    icon: BookOpen,
    title: "Applied learning",
    description: "Real projects, peer critique, and mentor sessions convert lessons into capability.",
  },
];

export default function Home() {
  return (
    <main className="bg-[radial-gradient(circle_at_top,_hsl(var(--brand-soft))_0%,_transparent_30%),linear-gradient(180deg,_hsl(var(--background))_0%,_#f7f3eb_55%,_hsl(var(--background))_100%)]">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-3xl px-lg py-4xl">
        <div className="grid gap-2xl lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-lg">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
              Skill Forge
            </p>
            <div className="space-y-md">
              <h1 className="max-w-4xl font-heading text-5xl font-semibold text-text-strong sm:text-6xl lg:text-7xl">
                A learning platform for ambitious product and engineering teams.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-text-soft">
                Build stronger technical judgment with guided programs, realistic practice,
                and progress tracking that feels useful instead of performative.
              </p>
            </div>
            <div className="flex flex-wrap gap-sm">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  View learner dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
            <div className="grid gap-md sm:grid-cols-3">
              {landingStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-surface/80 p-lg shadow-soft">
                  <p className="text-3xl font-semibold text-text-strong">{stat.value}</p>
                  <p className="mt-xs text-sm text-text-soft">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <div className="inline-flex w-fit items-center gap-xs rounded-full bg-brand-soft px-sm py-2xs text-sm font-medium text-brand-strong">
                <Sparkles className="size-4" />
                Featured cohort
              </div>
              <CardTitle className="font-heading text-2xl text-text-strong">
                Spring 2026 product engineering track
              </CardTitle>
              <CardDescription className="text-base leading-7">
                A 10-week curriculum focused on system design, frontend architecture,
                API reliability, and technical communication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-md">
              <div className="rounded-md bg-surface-muted p-md">
                <p className="text-sm font-medium text-text-strong">Next live session</p>
                <p className="mt-xs text-sm text-text-soft">
                  Thursday, 11:30 AM: Designing dashboards for dense information
                </p>
              </div>
              <ul className="space-y-sm text-sm text-text-soft">
                <li>Weekly mentor review and feedback loops</li>
                <li>Practice projects tied to delivery decisions</li>
                <li>Private dashboard for learners and team leads</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-lg md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="bg-surface/85">
              <CardHeader>
                <div className="inline-flex w-fit rounded-md bg-surface-strong p-sm text-brand">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="font-heading text-text-strong">{title}</CardTitle>
                <CardDescription className="text-base leading-7">{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="space-y-lg">
          <div className="space-y-sm">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
              Featured programs
            </p>
            <h2 className="font-heading text-3xl font-semibold text-text-strong">
              Built for serious upskilling, not passive content libraries
            </h2>
          </div>
          <div className="grid gap-lg lg:grid-cols-3">
            {featuredPrograms.map((program) => (
              <Card key={program.title} className="bg-surface/85">
                <CardHeader>
                  <CardTitle className="font-heading text-text-strong">{program.title}</CardTitle>
                  <CardDescription className="text-base leading-7">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm text-text-soft">
                  <span>{program.level}</span>
                  <span>{program.duration}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-lg pb-xl">
          <div className="space-y-sm">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
              Testimonials
            </p>
            <h2 className="font-heading text-3xl font-semibold text-text-strong">
              Teams use Skill Forge to make growth visible
            </h2>
          </div>
          <div className="grid gap-lg lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-surface/85">
                <CardHeader>
                  <CardDescription className="text-base leading-8 text-text-strong">
                    &ldquo;{testimonial.quote}&rdquo;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-text-strong">{testimonial.name}</p>
                  <p className="mt-xs text-sm text-text-soft">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
