// src/profile/profile.service.ts
import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Import UserService
import { User } from '../users/schemas/user.schema';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersService.findById(id); // Sử dụng findById từ UserService
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    // Tạo token xác thực email mới
    const verificationToken = this.tokenService.createEmailVerificationToken(email);
    await this.mailService.sendVerificationEmail(email, verificationToken);
  }


  async changePassword(username: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await bcrypt.compare(changePasswordDto.currentPassword, user.password))) {
      throw new UnauthorizedException('Invalid current password');
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New password and confirmation password do not match');
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.update(user.email, { password: hashedNewPassword });
  }
}
