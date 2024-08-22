// src/token/token.service.ts
import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service'; // Import ConfigService
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {}

  createAccessToken(username: string): string {
    return this.jwtService.sign({ username }, {
      secret: this.configService.jwtSecret, // Sử dụng secret cho access token từ ConfigService
      expiresIn: '15m', // Access token hết hạn sau 15 phút
    });
  }

  createRefreshToken(username: string): string {
    return this.jwtService.sign({ username }, {
      secret: this.configService.jwtRefreshSecret, // Sử dụng secret cho refresh token từ ConfigService
      expiresIn: '7d', // Refresh token hết hạn sau 7 ngày
    });
  }

  createEmailVerificationToken(email: string): string {
    return this.jwtService.sign({ email }, {
      secret: this.configService.jwtSecret, // Sử dụng cùng một secret cho token xác thực email
      expiresIn: '1m', // Token xác thực email hết hạn sau 1 ngày
    });
  }

  verifyEmailVerificationToken(token: string): { email: string } {
    return this.jwtService.verify(token, { secret: this.configService.jwtSecret }) as { email: string };
  }
}
