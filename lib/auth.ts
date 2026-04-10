import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.userType !== "ADMIN" && session.user.userType !== "MANAGER") {
    redirect("/dashboard");
  }

  return session;
}
