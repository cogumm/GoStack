import Redis, { Redis as RedisClient } from "ioredis";

import cacheConfig from "@config/cache";

import ICacheProvider from "../models/ICacheProvider";

export default class RedisCacheProvider implements ICacheProvider {
    private client: RedisClient;

    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    public async saveCache(key: string, value: any): Promise<void> {
        // console.log(key, value);
        // Salvando o value sempre convertido para JSON.
        await this.client.set(key, JSON.stringify(value));
    }

    public async recoverCache<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);

        if (!data) {
            return null;
        }

        // "Desconvertendo" o JSON.
        const parsedDate = JSON.parse(data) as T;

        return parsedDate;
    }

    public async invalidateCache(key: string): Promise<void> {}
}
