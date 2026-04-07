import { ArrowRight, Layers3, Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    description: "The component registry is initialized and includes a reusable Button component.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--brand-soft))_0%,_transparent_34%),linear-gradient(180deg,_hsl(var(--background))_0%,_#f4f0e7_52%,_hsl(var(--background))_100%)]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-3xl px-lg py-4xl lg:px-2xl">
        <div className="max-w-3xl space-y-xl">
          <span className="inline-flex items-center rounded-full border border-brand/20 bg-surface/85 px-md py-2xs text-sm font-semibold tracking-[0.01em] text-brand shadow-soft backdrop-blur">
            Fresh Next.js workspace
          </span>
          <div className="space-y-md">
            <h1 className="font-heading text-5xl font-semibold text-text-strong sm:text-6xl lg:text-7xl">
              Build your product surface, not your boilerplate.
            </h1>
            <p className="text-balance max-w-2xl text-xl leading-8 text-text-soft">
              This starter combines Next.js, Tailwind CSS, and shadcn/ui so you can
              move directly into feature work with a solid UI foundation.
            </p>
          </div>
          <div className="flex flex-wrap gap-sm">
            <Button size="lg" className="gap-2">
              Start building
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline">
              Customize theme
            </Button>
          </div>
        </div>

        <div className="grid gap-lg md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="surface-card rounded-lg border border-white/70 p-xl backdrop-blur"
            >
              <div className="mb-lg inline-flex rounded-md bg-surface-strong p-sm text-brand">
                <Icon className="size-5" />
              </div>
              <h2 className="font-heading text-xl text-text-strong">
                {title}
              </h2>
              <p className="mt-sm text-base leading-7 text-text-soft">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
