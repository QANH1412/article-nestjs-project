// src/profile/profile.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() request: Request) {
    const user = request.user as any;
    return this.profileService.findById(user._id); // sử dụng user.username nếu không có _id
  }
}
