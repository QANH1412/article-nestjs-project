import { Injectable, NestMiddleware, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../config/config.service';
import { BlacklistService } from '../../redis/blacklist.service';
import { JwtPayload } from '../../token/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../../token/jwt-auth.guard';

@Injectable()
export class UserActivityMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly blacklistService: BlacklistService,
    private readonly configService: ConfigService,
    
  ) {}

  @UseGuards(JwtAuthGuard)
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        // Giải mã token để lấy payload
        const payload = this.jwtService.verify<JwtPayload>(token, {
          secret: this.configService.jwtSecret,
        });

        // Tìm user dựa trên payload
        const user = await this.usersService.findByUsername(payload.username);

        // Gán user vào request để sử dụng trong các handler khác
        req.user = user;
        // console.log(user);
        
        // Cập nhật thời gian hoạt động cuối cùng
        await this.usersService.updateLastActivity(user.username);
      } catch (error) {
        
      }
    }

    next();
  }
}
