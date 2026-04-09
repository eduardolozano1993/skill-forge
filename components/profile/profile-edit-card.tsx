"use client";

import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { ProfileField } from "@/components/profile/profile-field";
import { reservedEmails } from "@/components/profile/profile-settings.constants";
import type { ProfileFormValues } from "@/components/profile/profile-settings.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProfileEditCardProps = {
  isEditing: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: FieldErrors<ProfileFormValues>;
  register: UseFormRegister<ProfileFormValues>;
  onCancel: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function ProfileEditCard({
  isEditing,
  isDirty,
  isSubmitting,
  errors,
  register,
  onCancel,
  onSubmit,
}: ProfileEditCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardEyebrow>Edit form</CardEyebrow>
        <CardTitle>Profile details</CardTitle>
        <CardDescription>
          Validation is handled with React Hook Form and Zod. Try one of the reserved emails to see
          the uniqueness rule.
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
              <Button type="button" variant="outline" onClick={onCancel}>
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
              Editing is off. Use <span className="font-medium text-text-strong">Edit profile</span>{" "}
              to reveal the form and update the local mock data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
