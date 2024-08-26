import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenService } from './token.service';
import { BlacklistService } from '../redis/blacklist.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly blacklistService: BlacklistService,
    private readonly configService: ConfigService,
  ) {}

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto;

   
    // Kiểm tra xem refresh token có bị blacklist không
    const isBlacklisted = await this.blacklistService.isBlacklisted(refreshToken);
    if (isBlacklisted) {
      throw new UnauthorizedException('Refresh token is blacklisted');
    }

    try {
      // Xác thực refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, { secret: this.configService.jwtRefreshSecret });
      const user = await this.usersService.findByUsername(payload.username);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Kiểm tra thời gian hoạt động cuối cùng của người dùng
      const currentTime = new Date();
      const lastActivity = new Date(user.lastActivity);
      const idleTime = (currentTime.getTime() - lastActivity.getTime()) / 1000; // Thời gian idle tính bằng giây

      // Nếu idle time vượt quá thời gian quy định (ví dụ: 5 ngày)
      if (idleTime > 5 * 24 * 60 * 60) { 
      const refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7 days
      await this.blacklistService.addToBlacklist(refreshToken, refreshTokenExpiresIn);
        throw new UnauthorizedException('Session expired, please log in again');
      }

      // Tạo mới access token và refresh token
      const newAccessToken = this.tokenService.createAccessToken(user.username);
      const newRefreshToken = this.tokenService.createRefreshToken(user.username);

      // Trả về access token mới và refresh token hiện tại
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
