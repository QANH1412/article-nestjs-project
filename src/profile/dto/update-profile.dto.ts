import { IsOptional, IsString, IsArray, ValidateNested, IsDateString, IsMongoId, IsEmail, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateProfileDto {
  
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

}
