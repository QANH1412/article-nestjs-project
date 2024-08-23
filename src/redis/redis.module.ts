import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { BlacklistService } from './blacklist.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const redis = new Redis(process.env.REDIS_URL);
        redis.on('error', (err) => console.error('Redis Client Error', err));
        return redis;
      },
    },
    BlacklistService,
  ],
  exports: ['REDIS_CLIENT', BlacklistService],
})
export class RedisModule {}
