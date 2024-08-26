import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { BlacklistService } from 'src/redis/blacklist.service';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class UpdateLastActivityMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly blacklistService: BlacklistService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (token) {
      // Kiểm tra xem token có bị blacklist không
      const isBlacklisted = await this.blacklistService.isBlacklisted(token);

      if (!isBlacklisted) {
        try {
          // Xác thực token và kiểm tra payload
          const payload = this.jwtService.verify(token);

          if (payload?.username) {
            // Cập nhật lastActivity nếu payload hợp lệ
            await this.usersService.updateLastActivity(payload.username);
          }
        } catch {
          // Token không hợp lệ hoặc hết hạn, không cần hành động gì thêm
        }
      }
    }

    next(); // Tiếp tục xử lý request
  }
}
