import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { jwtConstants } from './constants';
import { TokenService } from './token.service';
import { BlacklistService } from '../redis/blacklist.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly blacklistService: BlacklistService
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
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, { secret: jwtConstants.refreshSecret });
      const user = await this.usersService.findByUsername(payload.username);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
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
