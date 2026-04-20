import { getRedisClient } from "@/lib/utils/redis/redis";

export const COURSE_EDIT_LOCK_TTL_SECONDS = 120;

export type CourseEditLockState =
  | {
      status: "acquired";
      holderUserId: number;
      expiresInSeconds: number;
    }
  | {
      status: "conflict";
      holderUserId: number | null;
      expiresInSeconds: number;
    };

function getCourseEditLockKey(courseId: number) {
  return `lock:course-edit:${courseId}`;
}

function normalizeTtl(ttl: number) {
  return ttl > 0 ? ttl : 0;
}

export async function acquireCourseEditLock(
  courseId: number,
  adminUserId: number,
): Promise<CourseEditLockState> {
  const client = await getRedisClient();
  const lockKey = getCourseEditLockKey(courseId);
  const lockValue = String(adminUserId);

  const lockWasAcquired = await client.set(lockKey, lockValue, {
    NX: true,
    EX: COURSE_EDIT_LOCK_TTL_SECONDS,
  });

  if (lockWasAcquired === "OK") {
    return {
      status: "acquired",
      holderUserId: adminUserId,
      expiresInSeconds: COURSE_EDIT_LOCK_TTL_SECONDS,
    };
  }

  const existingLockOwner = await client.get(lockKey);

  if (existingLockOwner === lockValue) {
    await refreshCourseEditLock(courseId, adminUserId);

    return {
      status: "acquired",
      holderUserId: adminUserId,
      expiresInSeconds: COURSE_EDIT_LOCK_TTL_SECONDS,
    };
  }

  const ttl = await client.ttl(lockKey);

  return {
    status: "conflict",
    holderUserId:
      existingLockOwner && !Number.isNaN(Number(existingLockOwner))
        ? Number(existingLockOwner)
        : null,
    expiresInSeconds: normalizeTtl(ttl),
  };
}

export async function refreshCourseEditLock(
  courseId: number,
  adminUserId: number,
) {
  const client = await getRedisClient();
  const result = await client.eval(
    `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("EXPIRE", KEYS[1], ARGV[2])
      end

      return 0
    `,
    {
      keys: [getCourseEditLockKey(courseId)],
      arguments: [String(adminUserId), String(COURSE_EDIT_LOCK_TTL_SECONDS)],
    },
  );

  return Number(result) === 1;
}

export async function releaseCourseEditLock(
  courseId: number,
  adminUserId: number,
) {
  const client = await getRedisClient();
  const result = await client.eval(
    `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      end

      return 0
    `,
    {
      keys: [getCourseEditLockKey(courseId)],
      arguments: [String(adminUserId)],
    },
  );

  return Number(result) === 1;
}
