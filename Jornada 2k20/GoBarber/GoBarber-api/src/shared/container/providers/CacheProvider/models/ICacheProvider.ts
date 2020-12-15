export default interface ICacheProvider {
    saveCache(key: string, value: any): Promise<void>;

    recoverCache<T>(key: string): Promise<T | null>;

    invalidateCache(key: string): Promise<void>;

    invalidatePrefixCache(prefix: string): Promise<void>;
}
