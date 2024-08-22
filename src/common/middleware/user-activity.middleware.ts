import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../config/config.service';
import { BlacklistService } from '../../redis/blacklist.service';
import { JwtPayload } from '../../token/interfaces/jwt-payload.interface';

@Injectable()
export class UserActivityMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly blacklistService: BlacklistService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        
        // Giải mã token để lấy payload
        const payload = this.jwtService.verify<JwtPayload>(token, {
          secret: this.configService.jwtSecret,
        });

        // Tìm user dựa trên payload
        const user = await this.usersService.findByUsername(payload.username);
        if (!user) {
          throw new UnauthorizedException('User không tồn tại');
        }

        // Gán user vào request để sử dụng trong các handler khác
        req.user = user;

        // Cập nhật thời gian hoạt động cuối cùng
        await this.usersService.updateLastActivity(user.username);
      }
    } catch (error) {
      console.log('Error in UserActivityMiddleware:', error.message);
      // Nếu cần, bạn có thể throw lỗi ở đây để ngăn chặn request tiếp tục
      // throw new UnauthorizedException('Unauthorized request');
    }

    next();
  }
}
