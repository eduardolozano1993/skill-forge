import type { Prisma } from "@prisma/client";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

import { prisma } from "@/lib/utils/prisma/prisma";

export type AuthUserType = "ADMIN" | "MANAGER" | "EMPLOYEE";

export type AuthSessionUser = {
  id: string;
  email: string;
  name: string;
  displayName: string;
  phone: string;
  userType: AuthUserType;
  organizationId: number | null;
};

export type AuthenticatedSession = Session & {
  user: AuthSessionUser;
};

export const authUserSelect = {
  id: true,
  email: true,
  name: true,
  displayName: true,
  phone: true,
  userType: true,
  organizationId: true,
  status: true,
} satisfies Prisma.UserSelect;

export type AuthUserRecord = Prisma.UserGetPayload<{
  select: typeof authUserSelect;
}>;

export function getAuthUserId(value: unknown) {
  const userId = Number(value);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

export function isAuthUserType(value: unknown): value is AuthUserType {
  return value === "ADMIN" || value === "MANAGER" || value === "EMPLOYEE";
}

export function toAuthSessionUser(user: AuthUserRecord): AuthSessionUser {
  return {
    id: String(user.id),
    email: user.email,
    name: user.name,
    displayName: user.displayName,
    phone: user.phone,
    userType: user.userType,
    organizationId: user.organizationId,
  };
}

export function setSessionUser(
  session: Session,
  user: AuthSessionUser,
): AuthenticatedSession {
  return {
    ...session,
    user: {
      ...session.user,
      ...user,
    },
  };
}

export function getAuthSessionUserFromToken(token: JWT) {
  if (!token.sub || !isAuthUserType(token.userType)) {
    return null;
  }

  return {
    id: token.sub,
    email: token.email ?? "",
    name: token.name ?? "",
    displayName: typeof token.displayName === "string" ? token.displayName : "",
    phone: typeof token.phone === "string" ? token.phone : "",
    userType: token.userType,
    organizationId:
      typeof token.organizationId === "number" ? token.organizationId : null,
  } satisfies AuthSessionUser;
}

export function clearAuthTokenUser(token: JWT) {
  delete token.sub;
  delete token.email;
  delete token.name;
  delete token.displayName;
  delete token.phone;
  delete token.userType;
  delete token.organizationId;

  return token;
}

export function setTokenUser(token: JWT, user: AuthSessionUser | User) {
  token.sub = user.id;
  token.email = user.email;
  token.name = user.name;
  token.displayName = user.displayName;
  token.phone = user.phone;
  token.userType = user.userType;
  token.organizationId = user.organizationId ?? null;

  return token;
}

export async function loadActiveAuthUserById(userId: number) {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: authUserSelect,
  });

  if (!currentUser || currentUser.status !== "ACTIVE") {
    return null;
  }

  return currentUser;
}
