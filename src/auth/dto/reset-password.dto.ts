import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly resetPasswordToken: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly newPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;
}
