"use client";

import { startTransition, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronRight,
  Mail,
  MoonStar,
  Phone,
  SunMedium,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUiPreferences } from "@/components/providers/ui-preferences-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Profile = {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
};

const initialProfile: Profile = {
  fullName: "Avery Delgado",
  displayName: "Avery",
  email: "avery.delgado@skillforge.dev",
  phone: "+52 55 5555 0184",
};

const reservedEmails = [
  "jordan.rivera@skillforge.dev",
  "sam.chen@skillforge.dev",
  "maya.patel@skillforge.dev",
];

function createProfileSchema(currentEmail: string) {
  return z.object({
    fullName: z.string().trim().min(3, "Enter your full name."),
    displayName: z.string().trim().min(2, "Enter a display name."),
    email: z
      .email("Enter a valid email address.")
      .refine(
        (value) => {
          const normalizedValue = value.trim().toLowerCase();
          const normalizedCurrentEmail = currentEmail.trim().toLowerCase();

          return (
            normalizedValue === normalizedCurrentEmail ||
            !reservedEmails.includes(normalizedValue)
          );
        },
        {
          message: "This email is already in use.",
        },
      ),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone number.")
      .regex(/^[0-9+\-()\s]+$/, "Use only numbers and phone symbols."),
  });
}

type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;

function ProfileField({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-text-strong">{label}</span>
      <input
        {...props}
        className={cn(
          "w-full rounded-2xl border border-input bg-background px-md py-sm text-sm text-text-strong outline-none transition",
          "focus:border-brand focus:ring-2 focus:ring-[hsl(var(--brand)/0.2)]",
          error ? "border-destructive focus:ring-[hsl(var(--destructive)/0.2)]" : "",
        )}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </label>
  );
}

export function ProfileSettingsPage() {
  const [profile, setProfile] = useState(initialProfile);
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
              Review your profile details and update the mock account information stored in local
              component state.
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
          <Card variant="muted" className="overflow-hidden">
            <CardHeader>
              <CardEyebrow>Current data</CardEyebrow>
              <CardTitle>{profile.fullName}</CardTitle>
              <CardDescription>
                Public-facing account details shown with seeded mock data.
              </CardDescription>
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

          <Card className="overflow-hidden">
            <CardHeader>
              <CardEyebrow>Edit form</CardEyebrow>
              <CardTitle>Profile details</CardTitle>
              <CardDescription>
                Validation is handled with React Hook Form and Zod. Try one of the reserved emails
                to see the uniqueness rule.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form className="space-y-md" onSubmit={onSubmit}>
                  <div className="grid gap-md md:grid-cols-2">
                    <ProfileField
                      label="Full Name"
                      autoComplete="name"
                      error={errors.fullName?.message}
                      {...register("fullName")}
                    />
                    <ProfileField
                      label="Display Name"
                      autoComplete="nickname"
                      error={errors.displayName?.message}
                      {...register("displayName")}
                    />
                  </div>
                  <div className="grid gap-md md:grid-cols-2">
                    <ProfileField
                      label="Email"
                      type="email"
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                    <ProfileField
                      label="Phone"
                      type="tel"
                      autoComplete="tel"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                  </div>
                  <div className="rounded-2xl bg-surface-muted px-md py-sm text-sm text-text-soft">
                    Reserved mock emails: {reservedEmails.join(", ")}
                  </div>
                  <div className="flex flex-wrap justify-end gap-sm">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !isDirty}>
                      Save changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-surface-muted px-lg py-xl">
                  <p className="text-sm text-text-soft">
                    Editing is off. Use{" "}
                    <span className="font-medium text-text-strong">Edit profile</span> to reveal
                    the form and update the local mock data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-lg">
        <div className="space-y-xs">
          <h2 className="font-heading text-3xl font-semibold text-brand md:text-4xl">
            Application settings
          </h2>
          <p className="max-w-2xl text-sm text-text-soft">
            Manage visual preferences for this browser session and local workspace experience.
          </p>
        </div>

        <div className="grid gap-lg xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <Card variant="muted" className="overflow-hidden">
            <CardHeader>
              <CardEyebrow>Theme</CardEyebrow>
              <CardTitle>{theme === "light" ? "Light theme" : "Dark theme"}</CardTitle>
              <CardDescription>
                Switch the interface palette. The current selection is saved in local storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-md">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-md py-md text-left transition hover:border-brand hover:bg-surface-muted"
              >
                <span className="flex items-center gap-sm">
                  <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft text-brand">
                    {theme === "light" ? (
                      <MoonStar className="size-5" />
                    ) : (
                      <SunMedium className="size-5" />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-text-strong">
                      {theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
                    </span>
                    <span className="block text-sm text-text-soft">
                      {theme === "light"
                        ? "Reduce glare for evening sessions."
                        : "Use a brighter palette for daytime work."}
                    </span>
                  </span>
                </span>
                <ChevronRight className="size-4 text-text-soft" />
              </button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardEyebrow>Preference notes</CardEyebrow>
              <CardTitle>Local behavior</CardTitle>
              <CardDescription>
                These preferences apply locally in this browser and do not affect other users.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-sm md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface-muted px-md py-md">
                <p className="text-sm font-medium text-text-strong">Storage</p>
                <p className="mt-2xs text-sm text-text-soft">
                  Theme and sidebar preferences are persisted with browser local storage.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface-muted px-md py-md">
                <p className="text-sm font-medium text-text-strong">Scope</p>
                <p className="mt-2xs text-sm text-text-soft">
                  Changes update the current application shell immediately after selection.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
