import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { object, string } from "zod";

import { authenticateCredentials } from "@/lib/auth/credentials";
import { getClientIp } from "@/lib/auth/sign-in-rate-limit";
import {
  clearAuthTokenUser,
  getAuthSessionUserFromToken,
  getAuthUserId,
  loadActiveAuthUserById,
  setSessionUser,
  setTokenUser,
  toAuthSessionUser,
} from "@/lib/auth/user";

const credentialsSchema = object({
  email: string({ error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .transform((value) => value.toLowerCase()),
  password: string({ error: "Password is required" })
    .min(1, "Password is required")
    .max(32, "Password must be less than 32 characters"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
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
      async authorize(rawCredentials, request) {
        const parsedCredentials = credentialsSchema.safeParse(rawCredentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const authenticationResult = await authenticateCredentials({
          email,
          password,
          ip: getClientIp(request.headers),
        });

        if (authenticationResult.status !== "authenticated") {
          return null;
        }

        return toAuthSessionUser(authenticationResult.user);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return setTokenUser(token, user);
      }

      const userId = getAuthUserId(token.sub);
      if (userId === null) {
        return clearAuthTokenUser(token);
      }

      const currentUser = await loadActiveAuthUserById(userId);
      if (!currentUser) {
        return clearAuthTokenUser(token);
      }

      return setTokenUser(token, toAuthSessionUser(currentUser));
    },
    session({ session, token }) {
      const sessionUser = getAuthSessionUserFromToken(token);
      if (!session.user || !sessionUser) {
        return {
          ...session,
          user: undefined,
        };
      }

      return setSessionUser(session, sessionUser);
    },
    async authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isPublicPath =
        pathname === "/" ||
        pathname === "/sign-in" ||
        pathname.startsWith("/api/auth");

      if (isPublicPath) {
        return true;
      }

      const userId = getAuthUserId(auth?.user?.id);
      if (userId === null) {
        return false;
      }

      return (await loadActiveAuthUserById(userId)) !== null;
    },
  },
});
