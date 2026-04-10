import { compare, hash } from "bcryptjs";

export async function hashPassword(password: string) {
  return hash(password, 12);
}

type ComparePasswordArgs = {
  password: string;
  storedPassword: string;
};

export async function comparePassword({
  password,
  storedPassword,
}: ComparePasswordArgs) {
  return compare(password, storedPassword);
}
