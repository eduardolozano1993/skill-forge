import { getRedisClient } from "@/lib/redis/redis";

const MAX_FAILURES = 5;
const WINDOW_SECONDS = 15 * 60;
const BLOCK_SECONDS = 5 * 60;

function normalizeIpForRateLimit(ip: string) {
  const normalizedIp = ip.trim().toLowerCase() || "unknown";

  if (
    normalizedIp === "::1" ||
    normalizedIp === "127.0.0.1" ||
    normalizedIp === "::ffff:127.0.0.1"
  ) {
    return "localhost";
  }

  return normalizedIp;
}

// Extract client IP from headers, considering common proxy headers
export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? "unknown"
  );
}

// Generate a readable, Redis-safe key suffix from normalized email and IP.
export function getSignInRateLimitKey(email: string, ip: string) {
  const normalizedEmail = encodeURIComponent(email.trim().toLowerCase());
  const normalizedIp = encodeURIComponent(normalizeIpForRateLimit(ip));

  return `email:${normalizedEmail}:ip:${normalizedIp}`;
}

// Helper function to generate Redis keys for tracking attempts and blocks
function getRateLimitRedisKeys(key: string) {
  return {
    attemptsKey: `auth-rate-limited:signin:${key}`,
    blockKey: `auth-rate-limited:signin:block:${key}`,
  };
}

// Check if the user is currently blocked and return remaining block time in seconds
export async function getRemainingBlockSeconds(key: string) {
  const client = await getRedisClient();
  const { blockKey } = getRateLimitRedisKeys(key);
  const ttl = await client.ttl(blockKey);

  if (ttl <= 0) {
    return 0;
  }

  return ttl;
}

// Register a failed sign-in attempt, incrementing the count and blocking if threshold is reached
export async function registerFailedSignInAttempt(key: string) {
  const client = await getRedisClient();
  const { attemptsKey, blockKey } = getRateLimitRedisKeys(key);
  const retryAfterSeconds = await client.ttl(blockKey);

  if (retryAfterSeconds > 0) {
    return {
      blocked: true,
      thresholdReached: false,
      retryAfterSeconds,
    };
  }

  const attempts = await client.incr(attemptsKey);

  // Set expiration for the attempts key if it's the first failure
  await client.expire(attemptsKey, WINDOW_SECONDS, "NX");

  if (attempts >= MAX_FAILURES) {
    await client.set(blockKey, "1", {
      EX: BLOCK_SECONDS,
    });

    return {
      blocked: true,
      thresholdReached: true,
      retryAfterSeconds: BLOCK_SECONDS,
    };
  }

  return {
    blocked: false,
    thresholdReached: false,
    retryAfterSeconds: 0,
  };
}

// Reset failed attempts and unblock the user after a successful sign-in
export async function resetFailedSignInAttempts(key: string) {
  const client = await getRedisClient();
  const { attemptsKey, blockKey } = getRateLimitRedisKeys(key);

  await client.del([attemptsKey, blockKey]);
}
