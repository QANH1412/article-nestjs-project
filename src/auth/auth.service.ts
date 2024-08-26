// auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { TokenService } from '../token/token.service';
import { BlacklistService } from '../redis/blacklist.service';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService, 
    private readonly blacklistService: BlacklistService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<void> {
    const existingUser = await this.usersService.findByUsername(registerDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const existingUserEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingUserEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const userData = { ...registerDto, password: hashedPassword };
    const newUser = await this.usersService.create(userData);

    // Tạo token xác thực email
    const verificationToken = this.tokenService.createEmailVerificationToken(registerDto.email);
    await this.mailService.sendVerificationEmail(registerDto.email, verificationToken);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createTokens(user.username);
  }

  private createTokens(username: string): { accessToken: string; refreshToken: string } {
    const accessToken = this.tokenService.createAccessToken(username);
    const refreshToken = this.tokenService.createRefreshToken(username);
    return { accessToken, refreshToken };
  }

  public async oAuth2CreateTokens(username: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Create tokens
    const accessToken = this.tokenService.createAccessToken(username);
    const refreshToken = this.tokenService.createRefreshToken(username);
    return { accessToken, refreshToken };
  }

  async logout(accessToken: string, refreshToken: string): Promise<void> {
    const accessTokenExpiresIn = 15 * 60; // 15 minutes
    const refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7 days

    await this.blacklistService.addToBlacklist(accessToken, accessTokenExpiresIn);
    await this.blacklistService.addToBlacklist(refreshToken, refreshTokenExpiresIn);
  }

  async requestPasswordReset(requestResetDto: RequestResetPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(requestResetDto.email);
    if (!user) {
      throw new UnauthorizedException('No user found with this email');
    }

    const resetToken = this.tokenService.createPasswordResetToken(requestResetDto.email);
    await this.mailService.sendPasswordResetEmail(requestResetDto.email, resetToken);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }

    // Kiểm tra xem token có bị blacklist không
    const isBlacklisted = await this.blacklistService.isBlacklisted(resetPasswordDto.resetPasswordToken);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    const { email } = this.tokenService.verifyPasswordResetToken(resetPasswordDto.resetPasswordToken);
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.usersService.update(email, { password: hashedPassword });

    // bỏ token vào blacklist
    const resetTokenExpiresIn = 60 * 60; // 15 minutes
    await this.blacklistService.addToBlacklist(resetPasswordDto.resetPasswordToken, resetTokenExpiresIn);
  }

}
