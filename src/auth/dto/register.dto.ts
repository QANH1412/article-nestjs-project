import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsDate,
    IsMongoId,
    IsPhoneNumber,
    IsBoolean,
    IsEmail,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { Types } from 'mongoose';
  
  export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    readonly username: string;
  
    @IsString()
    @IsNotEmpty()
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
  