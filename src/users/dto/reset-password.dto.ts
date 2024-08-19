import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class ResetPasswordTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsDateString()
  @IsNotEmpty()
  expiredAt: Date;
}
