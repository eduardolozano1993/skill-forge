import { Clock3, PlayCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CourseCardProps = {
  title: string;
  summary: string;
  progressLabel: string;
  durationLabel: string;
};

export function CourseCard({
  title,
  summary,
  progressLabel,
  durationLabel,
}: CourseCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-sm">
        <div className="flex items-start justify-between gap-md">
          <div className="space-y-xs">
            <div className="flex items-center gap-xs text-sm font-medium text-brand">
              <PlayCircle className="size-4" />
              <span>Course</span>
            </div>
            <CardTitle className="font-heading text-2xl text-text-strong">{title}</CardTitle>
          </div>
          <div className="rounded-full bg-brand-soft px-sm py-2xs text-xs font-medium text-brand-strong">
            {progressLabel}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-md">
        <CardDescription className="max-w-md text-sm leading-6">{summary}</CardDescription>
        <div className="flex items-center gap-xs text-sm text-text-soft">
          <Clock3 className="size-4 text-brand" />
          <span>{durationLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
