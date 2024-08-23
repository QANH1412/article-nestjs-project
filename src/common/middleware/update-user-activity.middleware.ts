// src/auth/middleware/update-last-activity.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { BlacklistService } from 'src/redis/blacklist.service';


@Injectable()
export class UpdateLastActivityMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly blacklistService: BlacklistService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      // Kiểm tra xem token có bị blacklist không
      const isBlacklisted = await this.blacklistService.isBlacklisted(token);
      if (!isBlacklisted) {
        try {
          // Xác thực token và kiểm tra hạn
          const payload = this.jwtService.verify(token);

          // Nếu token hợp lệ, cập nhật lastActivity
          if (payload && payload.username) {
            await this.usersService.updateLastActivity(payload.username);
          }
        } catch (error) {
          // Token không hợp lệ hoặc hết hạn
          // Không cần thực hiện hành động gì thêm nếu token không hợp lệ
        }
      }
    }

    next(); // Tiếp tục xử lý request
  }
}
