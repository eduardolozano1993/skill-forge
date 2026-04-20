import { beforeEach, describe, expect, it, vi } from "vitest";

const { getRedisClientMock } = vi.hoisted(() => ({
  getRedisClientMock: vi.fn(),
}));

vi.mock("@/lib/utils/redis/redis", () => ({
  getRedisClient: getRedisClientMock,
}));

import {
  getClientIp,
  getRemainingBlockSeconds,
  getSignInRateLimitKey,
  registerFailedSignInAttempt,
  resetFailedSignInAttempts,
} from "./sign-in-rate-limit";

describe("sign-in rate limit helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads the first client IP from x-forwarded-for", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.10, 198.51.100.2",
      "x-real-ip": "198.51.100.3",
    });

    expect(getClientIp(headers)).toBe("203.0.113.10");
  });

  it("falls back through alternate IP headers", () => {
    expect(
      getClientIp(
        new Headers({
          "x-real-ip": "198.51.100.3",
        }),
      ),
    ).toBe("198.51.100.3");

    expect(
      getClientIp(
        new Headers({
          "cf-connecting-ip": "198.51.100.4",
        }),
      ),
    ).toBe("198.51.100.4");
  });

  it("normalizes email and loopback IP values when building the Redis key", () => {
    expect(
      getSignInRateLimitKey("  USER@Example.com ", "::ffff:127.0.0.1"),
    ).toBe("email:user%40example.com:ip:localhost");
  });

  it("returns zero when the block ttl is expired or missing", async () => {
    const client = {
      ttl: vi.fn().mockResolvedValue(-1),
    };
    getRedisClientMock.mockResolvedValue(client);

    await expect(getRemainingBlockSeconds("user-key")).resolves.toBe(0);
    expect(client.ttl).toHaveBeenCalledWith(
      "auth-rate-limited:signin:block:user-key",
    );
  });

  it("returns the remaining ttl when the block is active", async () => {
    const client = {
      ttl: vi.fn().mockResolvedValue(180),
    };
    getRedisClientMock.mockResolvedValue(client);

    await expect(getRemainingBlockSeconds("user-key")).resolves.toBe(180);
  });

  it("returns the active block without incrementing attempts", async () => {
    const client = {
      ttl: vi.fn().mockResolvedValue(120),
      incr: vi.fn(),
      expire: vi.fn(),
      set: vi.fn(),
    };
    getRedisClientMock.mockResolvedValue(client);

    await expect(registerFailedSignInAttempt("user-key")).resolves.toEqual({
      blocked: true,
      thresholdReached: false,
      retryAfterSeconds: 120,
    });

    expect(client.incr).not.toHaveBeenCalled();
    expect(client.set).not.toHaveBeenCalled();
  });

  it("increments attempts and sets the expiry window before the threshold is reached", async () => {
    const client = {
      ttl: vi.fn().mockResolvedValue(0),
      incr: vi.fn().mockResolvedValue(3),
      expire: vi.fn().mockResolvedValue(1),
      set: vi.fn(),
    };
    getRedisClientMock.mockResolvedValue(client);

    await expect(registerFailedSignInAttempt("user-key")).resolves.toEqual({
      blocked: false,
      thresholdReached: false,
      retryAfterSeconds: 0,
    });

    expect(client.incr).toHaveBeenCalledWith(
      "auth-rate-limited:signin:user-key",
    );
    expect(client.expire).toHaveBeenCalledWith(
      "auth-rate-limited:signin:user-key",
      15 * 60,
      "NX",
    );
    expect(client.set).not.toHaveBeenCalled();
  });

  it("creates the block key when the failure threshold is reached", async () => {
    const client = {
      ttl: vi.fn().mockResolvedValue(0),
      incr: vi.fn().mockResolvedValue(5),
      expire: vi.fn().mockResolvedValue(1),
      set: vi.fn().mockResolvedValue("OK"),
    };
    getRedisClientMock.mockResolvedValue(client);

    await expect(registerFailedSignInAttempt("user-key")).resolves.toEqual({
      blocked: true,
      thresholdReached: true,
      retryAfterSeconds: 5 * 60,
    });

    expect(client.set).toHaveBeenCalledWith(
      "auth-rate-limited:signin:block:user-key",
      "1",
      {
        EX: 5 * 60,
      },
    );
  });

  it("deletes both the attempts and block keys on reset", async () => {
    const client = {
      del: vi.fn().mockResolvedValue(2),
    };
    getRedisClientMock.mockResolvedValue(client);

    await resetFailedSignInAttempts("user-key");

    expect(client.del).toHaveBeenCalledWith([
      "auth-rate-limited:signin:user-key",
      "auth-rate-limited:signin:block:user-key",
    ]);
  });
});
