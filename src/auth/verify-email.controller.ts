// src/auth/verify-email.controller.ts
import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class VerifyEmailController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      const decoded = this.tokenService.verifyEmailVerificationToken(token);
      const user = await this.usersService.findByEmail(decoded.email);

      if (!user) {
        throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
      }

      // Cập nhật trạng thái của người dùng (ví dụ: email đã được xác thực)
      await this.usersService.updateVerifyEmail(user.email, true);

      res.redirect('http://localhost:3000'); // Redirect sau khi xác thực thành công
    } catch (error) {
      throw new HttpException('Invalid or expired token', HttpStatus.BAD_REQUEST);
    }
  }
}
