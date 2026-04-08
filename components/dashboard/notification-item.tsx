import { BellDot } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type NotificationItemProps = {
  title: string;
  message: string;
  meta: string;
};

export function NotificationItem({ title, message, meta }: NotificationItemProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-sm p-lg pb-sm">
        <div className="flex items-start gap-sm">
          <div className="rounded-full bg-brand-soft p-xs text-brand-strong">
            <BellDot className="size-3.5" />
          </div>
          <div className="space-y-xs">
            <CardTitle className="font-heading text-base text-text-strong">{title}</CardTitle>
            <CardDescription className="text-xs uppercase tracking-[0.12em]">{meta}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-lg pb-lg">
        <p className="text-sm leading-5 text-text-soft">{message}</p>
      </CardContent>
    </Card>
  );
}
