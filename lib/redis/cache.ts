import { getRedisClient } from "@/lib/redis/redis";

const DEFAULT_CACHE_TTL_SECONDS = 60 * 60; // 1 hour

export const ADMIN_PLATFORM_SUMMARY_CACHE_KEY = "cache:admin:platform-summary";

export function getManagerDashboardCacheKey(organizationId: number) {
  return `cache:manager:${organizationId}:dashboard`;
}

export function getCourseDetailActionStateCacheKey(
  courseId: number,
  userId: number,
) {
  return `cache:course:${courseId}:detail:${userId}`;
}

async function getOptionalRedisClient() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  try {
    return await getRedisClient();
  } catch (error) {
    console.error("Redis cache unavailable", error);
    return null;
  }
}

export async function readThroughJsonCache<T>(
  key: string,
  loadValue: () => Promise<T>,
  ttlSeconds = DEFAULT_CACHE_TTL_SECONDS,
): Promise<T> {
  const client = await getOptionalRedisClient();

  if (!client) {
    return loadValue();
  }

  try {
    const cachedValue = await client.get(key);

    if (cachedValue) {
      try {
        return JSON.parse(cachedValue) as T;
      } catch (error) {
        console.error(`Failed to parse cached JSON for key "${key}"`, error);
        await client.del(key);
      }
    }
  } catch (error) {
    console.error(`Failed to read Redis cache key "${key}"`, error);
  }

  const value = await loadValue();

  try {
    await client.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    console.error(`Failed to write Redis cache key "${key}"`, error);
  }

  return value;
}

export async function deleteCacheKeys(keys: Array<string | null | undefined>) {
  const normalizedKeys = Array.from(
    new Set(
      keys.filter(
        (key): key is string => typeof key === "string" && key.length > 0,
      ),
    ),
  );

  if (normalizedKeys.length === 0) {
    return;
  }

  const client = await getOptionalRedisClient();

  if (!client) {
    return;
  }

  try {
    await client.del(normalizedKeys);
  } catch (error) {
    console.error("Failed to delete Redis cache keys", error);
  }
}

async function scanKeysByPattern(pattern: string) {
  const client = await getOptionalRedisClient();

  if (!client) {
    return [];
  }

  const matchingKeys: string[] = [];
  let cursor = "0";

  try {
    do {
      const result = await client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = result.cursor;
      matchingKeys.push(...result.keys);
    } while (cursor !== "0");
  } catch (error) {
    console.error(
      `Failed to scan Redis cache keys for pattern "${pattern}"`,
      error,
    );
    return [];
  }

  return matchingKeys;
}

export async function deleteCacheKeysByPattern(patterns: string[]) {
  const matchingKeys = await Promise.all(
    patterns.map((pattern) => scanKeysByPattern(pattern)),
  );

  await deleteCacheKeys(matchingKeys.flat());
}
