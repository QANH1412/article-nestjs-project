// src/token/token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants'; // Import jwtConstants

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(username: string): string {
    return this.jwtService.sign({ username }, {
      secret: jwtConstants.secret, // Sử dụng secret cho access token
      expiresIn: '15m', // Access token hết hạn sau 15 phút
    });
  }

  createRefreshToken(username: string): string {
    return this.jwtService.sign({ username }, {
      secret: jwtConstants.refreshSecret, // Sử dụng secret cho refresh token
      expiresIn: '7d', // Refresh token hết hạn sau 7 ngày
    });
  }

  createEmailVerificationToken(email: string): string {
    return this.jwtService.sign({ email }, {
      secret: jwtConstants.secret, // Sử dụng cùng một secret cho token xác thực email
      expiresIn: '1m', // Token xác thực email hết hạn sau 1 ngày
    });
  }

  verifyEmailVerificationToken(token: string): { email: string } {
    return this.jwtService.verify(token, { secret: jwtConstants.secret }) as { email: string };
  }
}
