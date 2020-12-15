import Redis, { Redis as RedisClient } from "ioredis";

import cacheConfig from "@config/cache";

import ICacheProvider from "../models/ICacheProvider";

export default class RedisCacheProvider implements ICacheProvider {
    private client: RedisClient;

    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    public async saveCache(key: string, value: string): Promise<void> {
        // console.log(key, value);
        await this.client.set(key, value);
    }

    public async recoverCache(key: string): Promise<string | null> {
        const data = await this.client.get(key);

        return data;
    }

    public async invalidateCache(key: string): Promise<void> {}
}
