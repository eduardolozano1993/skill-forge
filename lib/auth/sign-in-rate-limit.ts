const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 5 * 60 * 1000;
const MAX_RECORDS = 500;

type RateLimitRecord = {
  attempts: number;
  firstFailureAt: number;
  blockedUntil: number | null;
  updatedAt: number;
};

type RateLimitStore = Map<string, RateLimitRecord>;

const globalForSignInRateLimit = globalThis as typeof globalThis & {
  signInRateLimitStore?: RateLimitStore;
};

const signInRateLimitStore =
  globalForSignInRateLimit.signInRateLimitStore ??
  new Map<string, RateLimitRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForSignInRateLimit.signInRateLimitStore = signInRateLimitStore;
}

function pruneExpiredEntries(now: number) {
  for (const [key, record] of signInRateLimitStore.entries()) {
    const isExpiredWindow =
      now - record.updatedAt > WINDOW_MS && !record.blockedUntil;
    const isExpiredBlock =
      record.blockedUntil !== null && record.blockedUntil <= now;

    if (isExpiredWindow || isExpiredBlock) {
      signInRateLimitStore.delete(key);
    }
  }

  if (signInRateLimitStore.size <= MAX_RECORDS) {
    return;
  }

  const oldestEntries = [...signInRateLimitStore.entries()]
    .sort((left, right) => left[1].updatedAt - right[1].updatedAt)
    .slice(0, signInRateLimitStore.size - MAX_RECORDS);

  for (const [key] of oldestEntries) {
    signInRateLimitStore.delete(key);
  }
}

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? "unknown"
  );
}

export function getSignInRateLimitKey(email: string, ip: string) {
  return `${email.trim().toLowerCase()}::${ip}`;
}

export function getRemainingBlockSeconds(key: string) {
  const now = Date.now();

  pruneExpiredEntries(now);

  const record = signInRateLimitStore.get(key);

  if (!record?.blockedUntil || record.blockedUntil <= now) {
    return 0;
  }

  return Math.ceil((record.blockedUntil - now) / 1000);
}

export function registerFailedSignInAttempt(key: string) {
  const now = Date.now();

  pruneExpiredEntries(now);

  const existingRecord = signInRateLimitStore.get(key);

  if (
    existingRecord &&
    existingRecord.blockedUntil !== null &&
    existingRecord.blockedUntil > now
  ) {
    return {
      blocked: true,
      thresholdReached: false,
      retryAfterSeconds: Math.ceil((existingRecord.blockedUntil - now) / 1000),
    };
  }

  const baseRecord =
    existingRecord && now - existingRecord.firstFailureAt < WINDOW_MS
      ? existingRecord
      : {
          attempts: 0,
          firstFailureAt: now,
          blockedUntil: null,
          updatedAt: now,
        };

  const attempts = baseRecord.attempts + 1;
  const blockedUntil = attempts >= MAX_FAILURES ? now + BLOCK_MS : null;

  signInRateLimitStore.set(key, {
    attempts,
    firstFailureAt: baseRecord.firstFailureAt,
    blockedUntil,
    updatedAt: now,
  });

  return {
    blocked: blockedUntil !== null,
    thresholdReached: blockedUntil !== null,
    retryAfterSeconds: blockedUntil
      ? Math.ceil((blockedUntil - now) / 1000)
      : 0,
  };
}

export function resetFailedSignInAttempts(key: string) {
  signInRateLimitStore.delete(key);
}
