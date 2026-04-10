"use client";

import { startTransition, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ProfileEditCard } from "@/components/profile/profile-edit-card";
import { ProfileSummaryCard } from "@/components/profile/profile-summary-card";
import {
  createProfileSchema,
  type ProfileFormValues,
} from "@/components/profile/profile-settings.schema";
import type { Profile } from "@/components/profile/profile-settings.types";
import { ThemePreferencesSection } from "@/components/profile/theme-preferences-section";
import { useUiPreferences } from "@/components/providers/ui-preferences-provider";
import { Button } from "@/components/ui/button";

type ProfileSettingsPageProps = {
  user: {
    name?: string | null;
    displayName: string;
    email: string;
    phone: string;
  };
};

function createInitialProfile(user: ProfileSettingsPageProps["user"]): Profile {
  return {
    fullName: user.name || user.displayName,
    displayName: user.displayName,
    email: user.email,
    phone: user.phone,
  };
}

export function ProfileSettingsPage({ user }: ProfileSettingsPageProps) {
  const [profile, setProfile] = useState(() => createInitialProfile(user));
  const [isEditing, setIsEditing] = useState(false);
  const { theme, toggleTheme } = useUiPreferences();

  const profileSchema = useMemo(() => createProfileSchema(profile.email), [profile.email]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(() => {
      setProfile({
        fullName: values.fullName.trim(),
        displayName: values.displayName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
      });
      reset(values);
      setIsEditing(false);
    });
  });

  const handleEditToggle = () => {
    reset(profile);
    setIsEditing((current) => !current);
  };

  const handleCancel = () => {
    reset(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-lg">
      <section className="space-y-lg">
        <div className="flex flex-col gap-sm md:flex-row md:items-end md:justify-between">
          <div className="space-y-xs">
            <h1 className="font-heading text-3xl font-semibold text-brand md:text-4xl">
              Profile settings
            </h1>
            <p className="max-w-2xl text-sm text-text-soft">
              Review the account details loaded from your authenticated session. Edits here are
              still a local draft until profile persistence is implemented.
            </p>
          </div>
          <Button
            type="button"
            variant={isEditing ? "outline" : "default"}
            onClick={handleEditToggle}
          >
            {isEditing ? "Close editor" : "Edit profile"}
          </Button>
        </div>

        <div className="grid gap-lg xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ProfileSummaryCard profile={profile} />
          <ProfileEditCard
            isEditing={isEditing}
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            errors={errors}
            register={register}
            onCancel={handleCancel}
            onSubmit={onSubmit}
          />
        </div>
      </section>

      <ThemePreferencesSection theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}
