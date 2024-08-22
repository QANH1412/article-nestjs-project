import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { BlacklistService } from '../redis/blacklist.service';
import { Request } from 'express';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService, 
    private readonly blacklistService: BlacklistService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: JwtStrategy.extractJwtFromRequest,
      secretOrKey: configService.jwtSecret,
      passReqToCallback: true,
    });
  }

  private static extractJwtFromRequest(req: Request): string | null {
    const authHeader = req.headers.authorization;
    
    return authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1]
    : null;
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = JwtStrategy.extractJwtFromRequest(req);

    // Kiểm tra xem token có bị blacklist không
    const isBlacklisted = await this.blacklistService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token đã bị vô hiệu hóa');
    }

    // Kiểm tra user dựa trên payload
    const user = await this.usersService.findByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }
    await this.usersService.updateLastActivity(user.username); 
    //  ********************** code này để test mà thôi *************** //
    // // Kiểm tra thời gian hoạt động cuối cùng của người dùng
    //   const currentTime = new Date();
    //   const lastActivity = new Date(user.lastActivity);
    //   const idleTime = (currentTime.getTime() - lastActivity.getTime()) / 1000; // Thời gian idle tính bằng giây

    //   // Nếu idle time vượt quá thời gian quy định (ví dụ: 5 ngày)
    //   if (idleTime > 5 * 24 * 60 * 60) { // 5 ngày tính bằng giây
    //     throw new UnauthorizedException('Session expired, please log in again');
    //   }

    return user;
  }
}
