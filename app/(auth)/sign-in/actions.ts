"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { authenticateCredentials } from "@/lib/auth/credentials";
import { getDeactivatedAccountDialogContent } from "@/lib/auth/deactivated-user";
import { getPostSignInRedirect } from "@/lib/auth/auth";
import { getClientIp } from "@/lib/auth/sign-in-rate-limit";

export type SignInFormState = {
  error?: string;
  deactivatedAccountDialog?: {
    title: string;
    description: string;
  };
};

export async function authenticate(
  _previousState: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/dashboard");
  const requestHeaders = await headers();
  const clientIp = getClientIp(requestHeaders);
  const authenticationResult = await authenticateCredentials({
    email,
    password,
    ip: clientIp,
  });

  if (authenticationResult.status === "blocked") {
    const retryAfterMinutes = Math.ceil(
      authenticationResult.retryAfterSeconds / 60,
    );

    return {
      error: `Too many sign-in attempts. Try again in ${retryAfterMinutes} minute${retryAfterMinutes === 1 ? "" : "s"}.`,
    };
  }

  if (authenticationResult.status === "invalid") {
    return { error: "Invalid email or password." };
  }

  if (authenticationResult.status === "deactivated") {
    return {
      deactivatedAccountDialog: getDeactivatedAccountDialogContent(
        authenticationResult.user.userType,
      ),
    };
  }

  const redirectTo = getPostSignInRedirect({
    userType: authenticationResult.user.userType,
    callbackUrl,
  });

  try {
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo,
    });

    redirect(signInResult?.url ?? redirectTo);
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Authentication failed. Try again." };
    }

    throw error;
  }
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}
