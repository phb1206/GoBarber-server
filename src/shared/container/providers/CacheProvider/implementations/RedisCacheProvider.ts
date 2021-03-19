import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
    private client: RedisClient;

    constructor() {
        this.client = new Redis(cacheConfig.config[cacheConfig.driver]);
    }

    public async save<T>(key: string, value: T): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
    }

    public async invalidate(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        const keys = await this.client.keys(`${prefix}:*`);

        const pipeline = this.client.pipeline();

        keys.forEach(key => pipeline.del(key));

        await pipeline.exec();
    }

    public async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        if (!value) return null;
        return JSON.parse(value);
    }
}
