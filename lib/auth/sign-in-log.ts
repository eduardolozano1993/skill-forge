import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SIGN_IN_LOG_DIR = path.join(process.cwd(), "logs", "sign_in");
const SIGN_IN_LOG_FILE = path.join(SIGN_IN_LOG_DIR, "lockouts.log");

type SignInLockoutLogArgs = {
  email: string;
  ip: string;
  retryAfterSeconds: number;
};

export async function logSignInLockout({
  email,
  ip,
  retryAfterSeconds,
}: SignInLockoutLogArgs) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] rate_limit_reached email=${email} ip=${ip} retry_after_seconds=${retryAfterSeconds}\n`;

  await mkdir(SIGN_IN_LOG_DIR, { recursive: true });

  let existingContent = "";

  try {
    existingContent = await readFile(SIGN_IN_LOG_FILE, "utf8");
  } catch (error) {
    const isMissingFile =
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT";

    if (!isMissingFile) {
      throw error;
    }
  }

  await writeFile(SIGN_IN_LOG_FILE, `${entry}${existingContent}`, "utf8");
}
