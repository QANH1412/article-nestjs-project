import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class BlacklistService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    if (expiresIn <= 0) {
      expiresIn = 1; // Thay đổi thành 1 giây để đảm bảo tính hợp lệ
    }
    await this.redisClient.set(token, 'blacklisted', 'EX', expiresIn);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redisClient.get(token);
    return result === 'blacklisted';
  }
}
