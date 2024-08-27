import { IsOptional, IsString, IsArray, ValidateNested, IsDateString, IsMongoId, IsEmail, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ResetPasswordTokenDto } from './reset-password.dto'; 
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @IsOptional()
  @Length(6, 20, { message: 'password must be between 6 and 20 characters long' })
  readonly password?: string; // Cập nhật mật khẩu khi cần

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsDateString()
  @IsOptional()
  readonly dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  readonly phoneNumber?: string;

  @IsMongoId()
  @IsOptional()
  readonly roleId?: Types.ObjectId;

  @IsOptional()
  readonly isEmailVerified?: boolean;

  @IsOptional()
  lastActivity?: Date;
  
}
