import Redis from "ioredis";

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (typeof window !== "undefined") {
    return null; // No Redis on client side
  }

  if (!redis && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redis.on("error", (error) => {
      console.error("Redis connection error:", error);
    });
  }

  return redis;
}

export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    if (!client) return null;

    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
}

export async function setJSON<T>(
  key: string,
  value: T,
  ttlSeconds = 300
): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error("Cache set error:", error);
  }
}

export async function deleteKey(key: string): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;

    await client.del(key);
  } catch (error) {
    console.error("Cache delete error:", error);
  }
}

export async function invalidateByPattern(pattern: string): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;

    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error("Cache invalidate error:", error);
  }
}

export async function setWithTags<T>(
  key: string,
  value: T,
  ttlSeconds = 300,
  tags: string[] = []
): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;

    // Set the main value
    await client.setex(key, ttlSeconds, JSON.stringify(value));

    // Set tag associations with same TTL
    if (tags.length > 0) {
      const tagPromises = tags.map(tag => {
        const tagKey = `tag:${tag}`;
        return client.sadd(tagKey, key).then(() => {
          return client.expire(tagKey, ttlSeconds);
        });
      });
      await Promise.all(tagPromises);
    }
  } catch (error) {
    console.error("Cache set with tags error:", error);
  }
}

export async function invalidateByTags(tags: string[]): Promise<void> {
  try {
    const client = getRedisClient();
    if (!client) return;

    for (const tag of tags) {
      const tagKey = `tag:${tag}`;
      const keys = await client.smembers(tagKey);
      
      if (keys.length > 0) {
        await client.del(...keys);
      }
      
      await client.del(tagKey);
    }
  } catch (error) {
    console.error("Cache invalidate by tags error:", error);
  }
}

// In-memory fallback cache for when Redis is not available
const memoryCache = new Map<string, { value: any; expires: number }>();

export async function getMemory<T>(key: string): Promise<T | null> {
  const item = memoryCache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expires) {
    memoryCache.delete(key);
    return null;
  }
  
  return item.value;
}

export async function setMemory<T>(
  key: string,
  value: T,
  ttlSeconds = 300
): Promise<void> {
  const expires = Date.now() + ttlSeconds * 1000;
  memoryCache.set(key, { value, expires });
  
  // Clean up expired entries periodically
  if (memoryCache.size > 1000) {
    const now = Date.now();
    for (const [k, v] of memoryCache.entries()) {
      if (now > v.expires) {
        memoryCache.delete(k);
      }
    }
  }
}

export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      if (params[key] != null && params[key] !== "") {
        acc[key] = params[key];
      }
      return acc;
    }, {} as Record<string, any>);
    
  const paramString = Object.keys(sortedParams).length > 0 
    ? JSON.stringify(sortedParams) 
    : "";
    
  return `${prefix}:${Buffer.from(paramString).toString("base64")}`;
}