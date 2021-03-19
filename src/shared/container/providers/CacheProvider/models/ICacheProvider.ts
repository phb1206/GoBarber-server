export default interface ICacheProvider {
    save<T>(key: string, value: T): Promise<void>;
    invalidate(key: string): Promise<void>;
    invalidatePrefix(prefix: string): Promise<void>;
    get<T>(key: string): Promise<T | null>;
}
