import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

type GlobalRedisState = typeof globalThis & {
  redisClient?: RedisClient;
  redisClientPromise?: Promise<RedisClient>;
};

const globalForRedis = globalThis as GlobalRedisState;

function createRedisConnection() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error("REDIS_URL is required for Redis-backed sign-in rate limiting.");
  }

  const client = createClient({
    url: redisUrl,
  });

  client.on("error", (error) => {
    console.error("Redis connection error", error);
  });

  return client;
}

export async function getRedisClient(): Promise<RedisClient> {
  let client = globalForRedis.redisClient;

  if (!client) {
    client = createRedisConnection();
    globalForRedis.redisClient = client;
  }

  if (client.isOpen) {
    return client;
  }

  const connectedClient = client;

  globalForRedis.redisClientPromise ??= connectedClient
    .connect()
    .then(() => connectedClient);

  try {
    return await globalForRedis.redisClientPromise;
  } finally {
    globalForRedis.redisClientPromise = undefined;
  }
}
