import { createClient } from "redis";

import { RedisClientType } from "redis";

const REDIS_ENDPOINT = process.env.REDIS_ENDPOINT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

let client: RedisClientType | null = null;

export const initRedisConnection = async () => {
  console.log('Initializing Redis connection');
  try {

    if(!REDIS_ENDPOINT || !REDIS_PASSWORD) {
      const err = new Error('REDIS_ENDPOINT or REDIS_PASSWORD is not set');
      console.error(err);
      throw err;
    }

    if (client === null) {
      console.log('Creating Redis client');
      client = createClient({
        url: `redis://${REDIS_ENDPOINT}`,
        password: REDIS_PASSWORD,
        socket: {
          tls: true,
          passphrase: '',
          port: 6379,
          reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
        },
      });

      client.on('error', (err) => console.error('Redis client error:', err));
      await client.connect();
      console.log('Redis connection connected');
    }

    return client;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const setCache = async (key: string, field: string, value: string, expiryTime = 3600) => {
  console.log(`[REDIS] Cache set request for ${key} with field ${field} with expiry value ${expiryTime}`);

  try {
    const expireTime = expiryTime ?? 3600;
    console.log(`Setting ${key} in redis cache with expire time of ${expireTime}`);
    const client = await initRedisConnection();
    if (!client) {
      console.error('Redis connection failed');
      return;
    }
    await client.hSet(key, field, value);
    await client.expire(key, expireTime);
  } catch (err) {
    console.error(err);
    return;
  }
};


export const getCache = async (key: string, field: string) => {
  console.log(`[REDIS] Cache get request for ${key}: ${field}`);

  try {
    const client = await initRedisConnection();

    if (!client) {
      console.log(`[REDIS] Connection not available`);
      return undefined;
    }
    const cachedValue = await client.hGet(key, field);

    if (cachedValue) {
      console.log(`[REDIS] Cache Hit`);
      const parsedObject = JSON.parse(cachedValue);
      return parsedObject;
    } else {
      console.log(`[REDIS] Cache Miss`);
      return undefined;
    }
  } catch (err) {
    console.error(err);
    return undefined;
  }
};