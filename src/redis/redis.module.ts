import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { BlacklistService } from './blacklist.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redis = new Redis({
          host: 'localhost',
          port: 6379,
          // Các tùy chọn khác nếu cần
        });
        redis.on('error', (err) => console.error('Redis Client Error', err));
        return redis;
      },
    },
    BlacklistService
  ],
  exports: ['REDIS_CLIENT', BlacklistService],
})
export class RedisModule {}
