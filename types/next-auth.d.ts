import type { DefaultSession } from "next-auth";
import type { AuthSessionUser, AuthUserType } from "@/lib/auth/user";

declare module "next-auth" {
  interface Session {
    user: NonNullable<DefaultSession["user"]> & AuthSessionUser;
  }

  interface User extends AuthSessionUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    displayName?: string;
    phone?: string;
    userType?: AuthUserType;
    organizationId?: number | null;
  }
}
