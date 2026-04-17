import type { Prisma } from "@prisma/client";

import { comparePassword } from "@/lib/auth/password";
import { logSignInLockout } from "@/lib/auth/sign-in-log";
import {
  getRemainingBlockSeconds,
  getSignInRateLimitKey,
  registerFailedSignInAttempt,
  resetFailedSignInAttempts,
} from "@/lib/auth/sign-in-rate-limit";
import { prisma } from "@/lib/prisma/prisma";

const credentialUserSelect = {
  id: true,
  email: true,
  password: true,
  name: true,
  displayName: true,
  phone: true,
  userType: true,
  organizationId: true,
  status: true,
} satisfies Prisma.UserSelect;

type CredentialUser = Prisma.UserGetPayload<{
  select: typeof credentialUserSelect;
}>;

export async function getAuthenticatedUserByCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<CredentialUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: credentialUserSelect,
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await comparePassword({
    password,
    storedPassword: user.password,
  });

  if (!isPasswordValid) {
    return null;
  }

  return user;
}

type CredentialAuthenticationSuccess =
  | {
      status: "authenticated";
      user: CredentialUser;
    }
  | {
      status: "deactivated";
      user: CredentialUser;
    };

export type CredentialAuthenticationResult =
  | CredentialAuthenticationSuccess
  | {
      status: "blocked";
      retryAfterSeconds: number;
    }
  | {
      status: "invalid";
    };

export async function authenticateCredentials({
  email,
  password,
  ip,
}: {
  email: string;
  password: string;
  ip: string;
}): Promise<CredentialAuthenticationResult> {
  const rateLimitKey = getSignInRateLimitKey(email, ip);
  const retryAfterSeconds = await getRemainingBlockSeconds(rateLimitKey);

  if (retryAfterSeconds > 0) {
    return {
      status: "blocked",
      retryAfterSeconds,
    };
  }

  const user = await getAuthenticatedUserByCredentials({
    email,
    password,
  });

  if (!user) {
    const failedAttempt = await registerFailedSignInAttempt(rateLimitKey);

    if (failedAttempt.thresholdReached) {
      await logSignInLockout({
        email,
        ip,
        retryAfterSeconds: failedAttempt.retryAfterSeconds,
      });
    }

    if (failedAttempt.blocked) {
      return {
        status: "blocked",
        retryAfterSeconds: failedAttempt.retryAfterSeconds,
      };
    }

    return {
      status: "invalid",
    };
  }

  await resetFailedSignInAttempts(rateLimitKey);

  if (user.status === "DEACTIVATED") {
    return {
      status: "deactivated",
      user,
    };
  }

  return {
    status: "authenticated",
    user,
  };
}
