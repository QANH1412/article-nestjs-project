import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlacklistService } from '../redis/blacklist.service';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly blacklistService: BlacklistService) {
    super();
  }

  

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    // Kiểm tra token blacklist
    if (token && await this.blacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token đã bị vô hiệu hóa');
    }

    // Tiếp tục với xác thực mặc định
    return super.canActivate(context) as Promise<boolean>;
  }
}
