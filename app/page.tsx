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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.20),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-6 py-20 lg:px-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-orange-200 bg-white/80 px-4 py-1 text-sm font-medium text-orange-700 shadow-sm backdrop-blur">
            Fresh Next.js workspace
          </span>
          <div className="space-y-4">
            <h1 className="font-heading text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Build your product surface, not your boilerplate.
            </h1>
            <p className="text-balance text-xl text-slate-600">
              This starter combines Next.js, Tailwind CSS, and shadcn/ui so you can
              move directly into feature work with a solid UI foundation.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="gap-2">
              Start building
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline">
              Customize theme
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-slate-950 p-3 text-orange-400">
                <Icon className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-slate-950">
                {title}
              </h2>
              <p className="mt-2 text-base text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
