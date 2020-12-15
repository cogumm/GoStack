import ICacheProvider from "../models/ICacheProvider";

interface ICacheData {
    [key: string]: string;
}

export default class FakeCacheProviders implements ICacheProvider {
    private cache: ICacheData = {};

    public async saveCache(key: string, value: any): Promise<void> {
        this.cache[key] = JSON.stringify(value);
    }

    public async recoverCache<T>(key: string): Promise<T | null> {
        const data = this.cache[key];

        if (!data) {
            return null;
        }

        const parsedDate = JSON.parse(data) as T;

        return parsedDate;
    }

    public async invalidateCache(key: string): Promise<void> {
        delete this.cache[key];
    }

    public async invalidatePrefixCache(prefix: string): Promise<void> {
        const keys = Object.keys(this.cache).filter(key =>
            key.startsWith(`${prefix}:`),
        );

        keys.forEach(key => delete this.cache[key]);
    }
}
