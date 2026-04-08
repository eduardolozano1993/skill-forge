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
      <CardHeader className="pb-sm">
        <div className="flex items-start gap-sm">
          <div className="rounded-full bg-brand-soft p-sm text-brand-strong">
            <BellDot className="size-4" />
          </div>
          <div className="space-y-xs">
            <CardTitle className="font-heading text-xl text-text-strong">{title}</CardTitle>
            <CardDescription className="text-sm">{meta}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-text-soft">{message}</p>
      </CardContent>
    </Card>
  );
}
