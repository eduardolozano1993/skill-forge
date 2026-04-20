import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getRedisClientMock } = vi.hoisted(() => ({
  getRedisClientMock: vi.fn(),
}));

vi.mock("@/lib/utils/redis/redis", () => ({
  getRedisClient: getRedisClientMock,
}));

import {
  ADMIN_PLATFORM_SUMMARY_CACHE_KEY,
  deleteCacheKeys,
  deleteCacheKeysByPattern,
  getManagerDashboardCacheKey,
  readThroughJsonCache,
} from "./cache";

describe("redis cache helpers", () => {
  const originalRedisUrl = process.env.REDIS_URL;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.REDIS_URL = originalRedisUrl;
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.REDIS_URL = originalRedisUrl;
    consoleErrorSpy.mockRestore();
  });

  it("exports stable cache key helpers", () => {
    expect(ADMIN_PLATFORM_SUMMARY_CACHE_KEY).toBe(
      "cache:admin:platform-summary",
    );
    expect(getManagerDashboardCacheKey(12)).toBe("cache:manager:12:dashboard");
  });

  it("falls back to the loader when REDIS_URL is missing", async () => {
    delete process.env.REDIS_URL;
    const loadValue = vi.fn().mockResolvedValue({ count: 2 });

    await expect(readThroughJsonCache("users", loadValue)).resolves.toEqual({
      count: 2,
    });

    expect(getRedisClientMock).not.toHaveBeenCalled();
    expect(loadValue).toHaveBeenCalledTimes(1);
  });

  it("returns cached JSON without calling the loader", async () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    const client = {
      get: vi.fn().mockResolvedValue('{"count":3}'),
      set: vi.fn(),
      del: vi.fn(),
    };
    const loadValue = vi.fn();
    getRedisClientMock.mockResolvedValue(client);

    await expect(readThroughJsonCache("users", loadValue)).resolves.toEqual({
      count: 3,
    });

    expect(client.get).toHaveBeenCalledWith("users");
    expect(loadValue).not.toHaveBeenCalled();
    expect(client.set).not.toHaveBeenCalled();
  });

  it("deletes invalid cached JSON, reloads the value, and writes it back with the ttl", async () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    const client = {
      get: vi.fn().mockResolvedValue("{invalid-json"),
      set: vi.fn().mockResolvedValue(undefined),
      del: vi.fn().mockResolvedValue(1),
    };
    const loadValue = vi.fn().mockResolvedValue({ count: 5 });
    getRedisClientMock.mockResolvedValue(client);

    await expect(
      readThroughJsonCache("users", loadValue, 120),
    ).resolves.toEqual({
      count: 5,
    });

    expect(client.del).toHaveBeenCalledWith("users");
    expect(loadValue).toHaveBeenCalledTimes(1);
    expect(client.set).toHaveBeenCalledWith("users", '{"count":5}', {
      EX: 120,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to parse cached JSON for key "users"',
      expect.any(SyntaxError),
    );
  });

  it("logs redis client acquisition failures and falls back to the loader", async () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    const error = new Error("boom");
    const loadValue = vi.fn().mockResolvedValue(["fresh"]);
    getRedisClientMock.mockRejectedValue(error);

    await expect(readThroughJsonCache("users", loadValue)).resolves.toEqual([
      "fresh",
    ]);

    expect(loadValue).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Redis cache unavailable",
      error,
    );
  });

  it("filters duplicate and empty keys before deleting them", async () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    const client = {
      del: vi.fn().mockResolvedValue(2),
    };
    getRedisClientMock.mockResolvedValue(client);

    await deleteCacheKeys(["users", null, "users", "", "admins"]);

    expect(client.del).toHaveBeenCalledWith(["users", "admins"]);
  });

  it("scans patterns, flattens matching keys, and deletes them", async () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    const client = {
      scan: vi
        .fn()
        .mockResolvedValueOnce({
          cursor: "1",
          keys: ["cache:manager:1:dashboard"],
        })
        .mockResolvedValueOnce({
          cursor: "0",
          keys: ["cache:manager:2:dashboard"],
        })
        .mockResolvedValueOnce({
          cursor: "0",
          keys: ["cache:admin:platform-summary"],
        }),
      del: vi.fn().mockResolvedValue(3),
    };
    getRedisClientMock.mockResolvedValue(client);

    await deleteCacheKeysByPattern(["cache:manager:*", "cache:admin:*"]);

    expect(client.scan.mock.calls).toEqual(
      expect.arrayContaining([
        [
          "0",
          {
            MATCH: "cache:manager:*",
            COUNT: 100,
          },
        ],
        [
          "1",
          {
            MATCH: "cache:manager:*",
            COUNT: 100,
          },
        ],
        [
          "0",
          {
            MATCH: "cache:admin:*",
            COUNT: 100,
          },
        ],
      ]),
    );
    expect(client.del).toHaveBeenCalledTimes(1);
    expect(client.del.mock.calls[0]?.[0]).toEqual(
      expect.arrayContaining([
        "cache:manager:1:dashboard",
        "cache:manager:2:dashboard",
        "cache:admin:platform-summary",
      ]),
    );
  });
});
