// src/profile/dto/change-password.dto.ts
import { IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(6, 20, { message: 'Current password must be between 6 and 20 characters long' })
  currentPassword: string;

  @IsString()
  @Length(6, 20, { message: 'New password must be between 6 and 20 characters long' })
  newPassword: string;

  @IsString()
  @Length(6, 20, { message: 'Confirmation password must be between 6 and 20 characters long' })
  confirmPassword: string;
}
