import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-lg py-4xl">
      <section className="space-y-lg">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Skill Forge
        </p>
        <div className="space-y-sm">
          <h1 className="font-heading text-5xl font-semibold text-text-strong">
            Minimal application foundation.
          </h1>
          <p className="max-w-2xl text-lg text-text-soft">
            The project now focuses on layout structure: a root layout, route groups,
            and an authenticated shell for product pages.
          </p>
        </div>
        <div className="flex flex-wrap gap-sm">
          <Button asChild>
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
