import { Activity, BarChart3, FolderKanban } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Active learners", value: "1,284", icon: Activity },
  { label: "Course progress", value: "76%", icon: BarChart3 },
  { label: "Open projects", value: "18", icon: FolderKanban },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-2xl px-lg py-2xl">
      <section className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          App route group
        </p>
        <h1 className="font-heading text-4xl font-semibold text-text-strong">
          Dashboard placeholder
        </h1>
        <p className="max-w-2xl text-base text-text-soft">
          This route lives under <code className="font-mono">/(app)</code> and is ready
          for authenticated product screens.
        </p>
      </section>

      <section className="grid gap-lg md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-text-soft">{label}</CardTitle>
              <Icon className="size-4 text-brand" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-text-strong">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
