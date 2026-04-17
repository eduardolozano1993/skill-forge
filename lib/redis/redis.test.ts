import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock("redis", () => ({
  createClient: createClientMock,
}));

type MockRedisClient = {
  isOpen: boolean;
  on: ReturnType<typeof vi.fn>;
  connect: ReturnType<typeof vi.fn>;
};

function createMockRedisClient(overrides?: Partial<MockRedisClient>) {
  return {
    isOpen: false,
    on: vi.fn(),
    connect: vi.fn(),
    ...overrides,
  };
}

async function importRedisModule() {
  return import("./redis");
}

describe("getRedisClient", () => {
  const originalRedisUrl = process.env.REDIS_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.REDIS_URL = originalRedisUrl;
    delete (globalThis as typeof globalThis & { redisClient?: unknown })
      .redisClient;
    delete (globalThis as typeof globalThis & { redisClientPromise?: unknown })
      .redisClientPromise;
  });

  afterEach(() => {
    process.env.REDIS_URL = originalRedisUrl;
    delete (globalThis as typeof globalThis & { redisClient?: unknown })
      .redisClient;
    delete (globalThis as typeof globalThis & { redisClientPromise?: unknown })
      .redisClientPromise;
  });

  it("throws when REDIS_URL is missing", async () => {
    delete process.env.REDIS_URL;

    const { getRedisClient } = await importRedisModule();

    await expect(getRedisClient()).rejects.toThrow(
      "REDIS_URL is required for Redis-backed sign-in rate limiting.",
    );
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("creates a client, registers the error handler, and connects it", async () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    const client = createMockRedisClient();
    client.connect.mockResolvedValue(undefined);
    createClientMock.mockReturnValue(client);

    const { getRedisClient } = await importRedisModule();

    await expect(getRedisClient()).resolves.toBe(client);

    expect(createClientMock).toHaveBeenCalledWith({
      url: "redis://localhost:6379",
    });
    expect(client.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(client.connect).toHaveBeenCalledTimes(1);
  });

  it("returns an already open global client without reconnecting", async () => {
    const client = createMockRedisClient({ isOpen: true });
    (globalThis as typeof globalThis & { redisClient?: unknown }).redisClient =
      client;

    const { getRedisClient } = await importRedisModule();

    await expect(getRedisClient()).resolves.toBe(client);

    expect(createClientMock).not.toHaveBeenCalled();
    expect(client.connect).not.toHaveBeenCalled();
  });

  it("reuses the same in-flight connection promise for concurrent calls", async () => {
    process.env.REDIS_URL = "redis://localhost:6379";
    const client = createMockRedisClient();

    let resolveConnect: (() => void) | undefined;
    client.connect.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveConnect = resolve;
        }),
    );
    createClientMock.mockReturnValue(client);

    const { getRedisClient } = await importRedisModule();

    const firstCall = getRedisClient();
    const secondCall = getRedisClient();

    expect(client.connect).toHaveBeenCalledTimes(1);

    resolveConnect?.();

    await expect(firstCall).resolves.toBe(client);
    await expect(secondCall).resolves.toBe(client);
  });
});
