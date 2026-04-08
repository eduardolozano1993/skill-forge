import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatTileProps = {
  label: string;
  value: string;
  detail: string;
};

export function StatTile({ label, value, detail }: StatTileProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-sm">
        <CardDescription className="text-sm uppercase tracking-[0.12em]">{label}</CardDescription>
        <div className="flex items-end justify-between gap-md">
          <CardTitle className="font-heading text-4xl text-text-strong">{value}</CardTitle>
          <div className="rounded-full bg-brand-soft p-xs text-brand-strong">
            <ArrowUpRight className="size-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-soft">{detail}</p>
      </CardContent>
    </Card>
  );
}
