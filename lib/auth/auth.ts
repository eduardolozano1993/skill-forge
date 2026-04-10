import { redirect } from "next/navigation";

import { auth } from "@/auth";

type UserType = "ADMIN" | "MANAGER" | "EMPLOYEE";

const roleHomeRoutes: Record<UserType, string> = {
  ADMIN: "/admin",
  MANAGER: "/manager",
  EMPLOYEE: "/dashboard",
};

export function getDefaultRouteForUserType(userType: UserType) {
  return roleHomeRoutes[userType];
}

function getSafeCallbackPath(callbackUrl?: string | null) {
  if (!callbackUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(callbackUrl, "http://localhost");

    if (parsedUrl.origin !== "http://localhost") {
      return null;
    }

    const normalizedPath = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

    return normalizedPath.startsWith("/") ? normalizedPath : null;
  } catch {
    return null;
  }
}

export function getPostSignInRedirect({
  userType,
  callbackUrl,
}: {
  userType: UserType;
  callbackUrl?: string | null;
}) {
  const defaultRoute = getDefaultRouteForUserType(userType);
  const safeCallbackPath = getSafeCallbackPath(callbackUrl);
  const callbackPathname = safeCallbackPath
    ? new URL(safeCallbackPath, "http://localhost").pathname
    : null;

  if (
    !safeCallbackPath ||
    callbackPathname === "/" ||
    callbackPathname === "/sign-in" ||
    callbackPathname === "/dashboard" ||
    callbackPathname === "/manager" ||
    callbackPathname === "/admin"
  ) {
    return defaultRoute;
  }

  return safeCallbackPath;
}

export function redirectToUserHome(userType: UserType) {
  redirect(getDefaultRouteForUserType(userType));
}

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session;
}

async function requireUserType(allowedUserTypes: UserType[]) {
  const session = await requireAuth();

  if (!allowedUserTypes.includes(session.user.userType)) {
    redirectToUserHome(session.user.userType);
  }

  return session;
}

export async function requireEmployee() {
  return requireUserType(["EMPLOYEE"]);
}

export async function requireManager() {
  return requireUserType(["MANAGER"]);
}

export async function requireManagerOrAdmin() {
  return requireUserType(["MANAGER", "ADMIN"]);
}

export async function requireAdmin() {
  return requireUserType(["ADMIN"]);
}
