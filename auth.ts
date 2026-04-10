import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { object, string } from "zod";

import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";

const credentialsSchema = object({
  email: string({ error: "Email is required" }).min(1, "Email is required"),
  password: string({ error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsedCredentials = credentialsSchema.safeParse(rawCredentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await prisma.user.findUnique({
          where: { email },
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

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          displayName: user.displayName,
          phone: user.phone,
          userType: user.userType,
          organizationId: user.organizationId,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.displayName = user.displayName;
        token.phone = user.phone;
        token.userType = user.userType;
        token.organizationId = user.organizationId ?? null;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.email = token.email ?? session.user.email ?? "";
        session.user.name = token.name ?? session.user.name ?? "";
        session.user.displayName =
          typeof token.displayName === "string" ? token.displayName : "";
        session.user.phone = typeof token.phone === "string" ? token.phone : "";
        session.user.userType =
          token.userType === "ADMIN" ||
          token.userType === "MANAGER" ||
          token.userType === "EMPLOYEE"
            ? token.userType
            : "EMPLOYEE";
        session.user.organizationId =
          typeof token.organizationId === "number"
            ? token.organizationId
            : null;
      }

      return session;
    },
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isAuthenticated = Boolean(auth?.user);
      const isPublicPath =
        pathname === "/" ||
        pathname === "/sign-in" ||
        pathname.startsWith("/api/auth");

      if (isPublicPath) {
        return true;
      }

      return isAuthenticated;
    },
  },
});
