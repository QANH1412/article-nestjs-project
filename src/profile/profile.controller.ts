// src/profile/profile.controller.ts
import { Controller, Get, Req, UseGuards, Post, HttpException, HttpStatus, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../token/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { Request, Response } from 'express';


@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() request: Request) {
    const user = request.user as any;
    return this.profileService.findById(user._id); // sử dụng user.username nếu không có _id
  }

  @UseGuards(JwtAuthGuard)
  @Post('/resend-verification-email')
  async resendVerificationEmail(@Req() request: Request, @Res() res: Response){
    const user = request.user as any;
    try {
      await this.profileService.resendVerificationEmail(user.email);
      res.status(HttpStatus.CREATED).json({ message: ' Please check your email to verify your account.' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
