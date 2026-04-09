import { z } from "zod";

import { reservedEmails } from "@/components/profile/profile-settings.constants";

export function createProfileSchema(currentEmail: string) {
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

export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;
