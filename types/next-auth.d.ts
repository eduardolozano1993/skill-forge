import type { DefaultSession } from "next-auth";

type UserType = "ADMIN" | "MANAGER" | "EMPLOYEE";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      displayName: string;
      phone: string;
      userType: UserType;
      organizationId: number | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    displayName: string;
    phone: string;
    userType: UserType;
    organizationId: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    displayName?: string;
    phone?: string;
    userType?: UserType;
    organizationId?: number | null;
  }
}
