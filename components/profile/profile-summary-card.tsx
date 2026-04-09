import { Mail, Phone, UserRound } from "lucide-react";

import type { Profile } from "@/components/profile/profile-settings.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProfileSummaryCardProps = {
  profile: Profile;
};

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <Card variant="muted" className="overflow-hidden">
      <CardHeader>
        <CardEyebrow>Current data</CardEyebrow>
        <CardTitle>{profile.fullName}</CardTitle>
        <CardDescription>Public-facing account details shown with seeded mock data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-md">
        <div className="flex items-center gap-sm rounded-2xl bg-surface px-md py-md">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft text-brand">
            <UserRound className="size-5" />
          </span>
          <div>
            <p className="font-medium text-text-strong">{profile.displayName}</p>
            <p className="text-sm text-text-soft">Display name</p>
          </div>
        </div>
        <div className="space-y-sm">
          <div className="flex items-start gap-sm rounded-2xl border border-border bg-surface px-md py-md">
            <Mail className="mt-0.5 size-4 text-brand" />
            <div>
              <p className="text-sm font-medium text-text-strong">{profile.email}</p>
              <p className="text-sm text-text-soft">Unique email address</p>
            </div>
          </div>
          <div className="flex items-start gap-sm rounded-2xl border border-border bg-surface px-md py-md">
            <Phone className="mt-0.5 size-4 text-brand" />
            <div>
              <p className="text-sm font-medium text-text-strong">{profile.phone}</p>
              <p className="text-sm text-text-soft">Primary contact number</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
