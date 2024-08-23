import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsMongoId,
  IsPhoneNumber,
  IsBoolean,
  IsEmail,
  Length
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'password must be between 6 and 20 characters long' })
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly dateOfBirth?: Date;

  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsMongoId()
  readonly roleId?: Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  readonly isEmailVerified?: boolean;
}
