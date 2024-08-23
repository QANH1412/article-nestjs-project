import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get mongodbUri(): string {
    return this.configService.get<string>('MONGODB_URI');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }

  get emailUser(): string {
    return this.configService.get<string>('EMAIL_USER');
  }

  get emailPass(): string {
    return this.configService.get<string>('EMAIL_PASSWORD');
  }
}
