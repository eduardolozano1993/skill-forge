import { requireAuth } from "../../auth/auth";

export async function isAdmin(): Promise<boolean> {
  const session = await requireAuth();
  return session.user.userType === "ADMIN";
}
