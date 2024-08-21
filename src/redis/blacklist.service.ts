import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class BlacklistService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // Thêm username vào blacklist
  async addToBlacklist(username: string, expiresIn: number): Promise<void> {
    await this.redisClient.set(username, 'blacklisted', 'EX', expiresIn);
  }

  // Kiểm tra xem username có bị blacklist không
  async isBlacklisted(username: string): Promise<boolean> {
    const result = await this.redisClient.get(username);
    return result === 'blacklisted';
  }
}
