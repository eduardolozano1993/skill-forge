import { Shield, Users, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const adminCards = [
  { title: "Roles", detail: "Manage permissions and access policies.", icon: Shield },
  { title: "Users", detail: "Review accounts, teams, and invitations.", icon: Users },
  { title: "System", detail: "Track flags, maintenance, and operations.", icon: Wrench },
];

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-2xl px-lg py-3xl">
      <section className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Admin route group
        </p>
        <h1 className="font-heading text-4xl font-semibold text-text-inverse">
          Admin console placeholder
        </h1>
        <p className="max-w-2xl text-base text-slate-300">
          This route lives under <code className="font-mono">/(admin)</code> and gives
          you a dedicated surface for operational and management tooling.
        </p>
      </section>

      <section className="grid gap-lg md:grid-cols-3">
        {adminCards.map(({ title, detail, icon: Icon }) => (
          <Card
            key={title}
            className="border-white/10 bg-white/5 text-text-inverse shadow-none backdrop-blur"
          >
            <CardHeader>
              <div className="mb-md inline-flex w-fit rounded-md bg-white/10 p-sm text-brand">
                <Icon className="size-5" />
              </div>
              <CardTitle className="font-heading text-text-inverse">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-slate-300">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
