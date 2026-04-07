import Link from "next/link";
import { ArrowRight, Layers3, ShieldCheck, Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    icon: Layers3,
    title: "App Router",
    description: "A current Next.js setup with TypeScript and a clean project baseline.",
  },
  {
    icon: Sparkles,
    title: "Tailwind CSS",
    description: "Utility-first styling is wired into the app with design tokens ready to expand.",
  },
  {
    icon: Wand2,
    title: "shadcn/ui",
    description: "The component registry is initialized and includes reusable UI primitives.",
  },
];

const routes = [
  { href: "/sign-in", label: "Auth", icon: ShieldCheck },
  { href: "/dashboard", label: "App", icon: Layers3 },
  { href: "/admin", label: "Admin", icon: Sparkles },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--brand-soft))_0%,_transparent_34%),linear-gradient(180deg,_hsl(var(--background))_0%,_#f4f0e7_52%,_hsl(var(--background))_100%)]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-3xl px-lg py-4xl lg:px-2xl">
        <div className="max-w-3xl space-y-xl">
          <span className="inline-flex items-center rounded-full border border-brand/20 bg-surface/85 px-md py-2xs text-sm font-semibold tracking-[0.01em] text-brand shadow-soft backdrop-blur">
            Marketing route group
          </span>
          <div className="space-y-md">
            <h1 className="font-heading text-5xl font-semibold text-text-strong sm:text-6xl lg:text-7xl">
              Build your product surface, not your boilerplate.
            </h1>
            <p className="text-balance max-w-2xl text-xl leading-8 text-text-soft">
              The app is now split into marketing, auth, app, and admin route groups so
              each area can evolve independently without changing public URLs.
            </p>
          </div>
          <div className="flex flex-wrap gap-sm">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Open app area
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Visit auth flow</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-lg md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="surface-card border-white/70 bg-white/80 backdrop-blur"
            >
              <CardHeader className="pb-sm">
                <div className="mb-lg inline-flex w-fit rounded-md bg-surface-strong p-sm text-brand">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="font-heading text-text-strong">{title}</CardTitle>
                <CardDescription className="mt-sm text-base leading-7">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="px-0 text-brand hover:bg-transparent" asChild>
                  <Link href="/dashboard">
                    Explore primitive
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-md md:grid-cols-3">
          {routes.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between rounded-md border border-border bg-surface px-lg py-md text-text-strong shadow-soft transition-colors hover:border-brand/30 hover:text-brand"
            >
              <span className="inline-flex items-center gap-sm font-medium">
                <Icon className="size-4" />
                {label}
              </span>
              <ArrowRight className="size-4" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
