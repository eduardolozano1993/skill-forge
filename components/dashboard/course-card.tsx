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
  dueDateLabel: string;
};

export function CourseCard({
  title,
  summary,
  dueDateLabel,
}: CourseCardProps) {
  return (
    <Card className="h-full min-w-0">
      <CardHeader className="space-y-sm p-lg pb-sm">
        <div className="min-w-0 space-y-xs">
          <div className="flex items-center gap-xs text-xs font-medium uppercase tracking-[0.12em] text-brand">
            <PlayCircle className="size-3.5" />
            <span>Course</span>
          </div>
          <CardTitle className="line-clamp-2 font-heading text-lg text-text-strong">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-sm p-lg pt-0 text-left">
        <CardDescription className="line-clamp-3 text-sm leading-5">{summary}</CardDescription>
        <div className="flex w-full items-center justify-start gap-xs self-start text-left text-xs text-text-soft">
          <Clock3 className="size-3.5 text-brand" />
          <span>Due {dueDateLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
