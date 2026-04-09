"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

type CoursesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CoursesError({ error, reset }: CoursesErrorProps) {
  return (
    <section className="rounded-xl border border-[hsl(var(--brand)/0.25)] bg-brand-soft p-lg">
      <div className="space-y-xs">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">Courses</p>
        <h1 className="font-heading text-2xl font-semibold text-text-strong">
          Course catalog unavailable
        </h1>
        <p className="max-w-2xl text-sm text-text-soft">
          We couldn&apos;t load the courses right now. Try again or return to the dashboard.
        </p>
        {error.digest ? (
          <p className="text-xs text-text-soft">Reference: {error.digest}</p>
        ) : null}
      </div>

      <div className="mt-lg flex gap-sm">
        <Button onClick={reset}>Retry</Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
