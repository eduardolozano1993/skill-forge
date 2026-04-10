"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { getPostSignInRedirect } from "@/lib/auth/auth";
import { logSignInLockout } from "@/lib/auth/sign-in-log";
import {
  getClientIp,
  getRemainingBlockSeconds,
  getSignInRateLimitKey,
  registerFailedSignInAttempt,
  resetFailedSignInAttempts,
} from "@/lib/auth/sign-in-rate-limit";
import { prisma } from "@/lib/prisma/prisma";

export type SignInFormState = {
  error?: string;
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
  const rateLimitKey = getSignInRateLimitKey(email, clientIp);
  const retryAfterSeconds = getRemainingBlockSeconds(rateLimitKey);
  const matchedUser = await prisma.user.findUnique({
    where: { email },
    select: { userType: true },
  });

  if (retryAfterSeconds > 0) {
    const retryAfterMinutes = Math.ceil(retryAfterSeconds / 60);

    return {
      error: `Too many sign-in attempts. Try again in ${retryAfterMinutes} minute${retryAfterMinutes === 1 ? "" : "s"}.`,
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: matchedUser
        ? getPostSignInRedirect({
            userType: matchedUser.userType,
            callbackUrl,
          })
        : callbackUrl || "/dashboard",
    });

    resetFailedSignInAttempts(rateLimitKey);
  } catch (error) {
    if (error instanceof AuthError) {
      const authError = error as AuthError;

      if (authError.type === "CredentialsSignin") {
        const failedAttempt = registerFailedSignInAttempt(rateLimitKey);

        if (failedAttempt.thresholdReached) {
          await logSignInLockout({
            email,
            ip: clientIp,
            retryAfterSeconds: failedAttempt.retryAfterSeconds,
          });
        }

        if (failedAttempt.blocked) {
          const retryAfterMinutes = Math.ceil(
            failedAttempt.retryAfterSeconds / 60,
          );

          return {
            error: `Too many sign-in attempts. Try again in ${retryAfterMinutes} minute${retryAfterMinutes === 1 ? "" : "s"}.`,
          };
        }

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
