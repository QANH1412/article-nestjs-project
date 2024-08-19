import { IsOptional, IsString, IsArray, ValidateNested, IsDateString, IsMongoId, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ResetPasswordTokenDto } from './reset-password.dto'; 
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @IsOptional()
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResetPasswordTokenDto)
  @IsOptional()
  readonly resetPasswordToken?: ResetPasswordTokenDto[];
}
