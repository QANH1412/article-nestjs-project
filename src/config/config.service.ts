import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get mongodbUri(): string {
    return this.configService.get<string>('MONGODB_URI');
  }
}
