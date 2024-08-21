// src/profile/profile.service.ts
import { Injectable, NotFoundException, ConflictException  } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Import UserService
import { User } from '../users/schemas/user.schema';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';

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
}
