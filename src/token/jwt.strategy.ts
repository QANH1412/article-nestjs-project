import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { jwtConstants } from './constants';
import { BlacklistService } from '../redis/blacklist.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService, 
    private readonly blacklistService: BlacklistService,
  ) {
    super({
      jwtFromRequest: JwtStrategy.extractJwtFromRequest,
      secretOrKey: jwtConstants.secret,
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

    return user;
  }
}
