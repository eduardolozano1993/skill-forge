import { comparePassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma/prisma";

export async function getAuthenticatedUserByCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
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

  return user;
}
