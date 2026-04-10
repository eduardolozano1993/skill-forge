"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

export type SignInFormState = {
  error?: string;
};

export async function authenticate(
  _previousState: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/dashboard");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const authError = error as AuthError;

      if (authError.type === "CredentialsSignin") {
        return { error: "Invalid email or password." };
      }

      return { error: "Authentication failed. Try again." };
    }

    throw error;
  }

  return {};
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}
