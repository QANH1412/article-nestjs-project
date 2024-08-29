// src/profile/profile.controller.ts
import { Controller, Body, Get, Req, UseGuards, Post, HttpException, HttpStatus, Res, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../token/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { Request, Response } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Profile') // Thêm tag cho controller
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() request: Request) {
    const user = request.user as any;
    return this.profileService.findById(user._id); 
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: Response
  ) {
    const user = request.user as any;
    try {
      await this.profileService.changePassword(user.username, changePasswordDto);
      res.status(HttpStatus.OK).json({ message: 'Password changed successfully' });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
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

  @UseGuards(JwtAuthGuard)
  @Put('/update')
  async updateProfile(
    @Req() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() res: Response
  ) {
    const user = request.user as any;
    try {
      const updatedUser = await this.profileService.updateProfile(user.email, updateProfileDto);
      res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
