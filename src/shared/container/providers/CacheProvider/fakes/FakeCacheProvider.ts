import ICacheProvider from '../models/ICacheProvider';

interface CacheObject {
    [key: string]: string;
}

export default class RedisCacheProvider implements ICacheProvider {
    private cache: CacheObject = {};

    public async save<T>(key: string, value: T): Promise<void> {
        this.cache[key] = JSON.stringify(value);
    }

    public async invalidate(key: string): Promise<void> {
        delete this.cache[key];
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        const keys = Object.keys(this.cache).filter(key =>
            key.startsWith(`${prefix}:`),
        );

        keys.forEach(key => delete this.cache[key]);
    }

    public async get<T>(key: string): Promise<T | null> {
        const value = this.cache[key];
        if (!value) return null;
        return JSON.parse(value);
    }
}
