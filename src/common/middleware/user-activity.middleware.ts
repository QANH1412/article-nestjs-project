import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UserActivityMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Lấy user từ request.user (được gán bởi JwtAuthGuard)
    const user = req.user as any; // Nếu không có trường user, bạn có thể thay đổi theo cấu trúc của bạn

    if (user && user.username) {
      // Cập nhật thời gian hoạt động của người dùng
      await this.usersService.updateLastActivity(user.name);
    }

    next();
  }
}