export default interface ICacheProvider {
    saveCache(key: string, value: string): Promise<void>;

    recoverCache(key: string): Promise<string | null>;

    invalidateCache(key: string): Promise<void>;
}
