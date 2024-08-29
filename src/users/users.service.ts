// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { CreateOauth2UserDto } from './dto/create-Oauth2-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly rolesService: RolesService
  ) {}

  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const defaultRole = await this.rolesService.findByName('user');
    if (!defaultRole) {
      throw new ConflictException('Default role "user" not found');
    }

    const userDto: CreateUserDto = {
      ...createUserDto,
      roleId: defaultRole._id as Types.ObjectId // Convert to Types.ObjectId
    };

    return this.userRepository.create(userDto);
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    const adminRole = await this.rolesService.findByName('admin');
    if (!adminRole) {
      throw new ConflictException('Role "admin" not found');
    }

    const existingUser = await this.findByUsername(createUserDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const existingUserEmail = await this.findByEmail(createUserDto.email);
    if (existingUserEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userDto: CreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
      roleId: adminRole._id as Types.ObjectId // Convert to Types.ObjectId
    };

    return this.userRepository.create(userDto);
  }

  async createOauth2(createOauth2UserDto: CreateOauth2UserDto): Promise<User> {
    const defaultRole = await this.rolesService.findByName('user');
    if (!defaultRole) {
      throw new ConflictException('Default role "user" not found');
    }

    const userDto: CreateOauth2UserDto = {
      ...createOauth2UserDto,
      roleId: defaultRole._id as Types.ObjectId // Convert to Types.ObjectId
    };

    return this.userRepository.createOauth2(userDto);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }


  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userRepository.update(email, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with Email ${email} not found`);
    }
    return updatedUser;
  }

  async updateLastActivity(username: string): Promise<void> {
    await this.userRepository.updateLastActivity(username);
  }

  async updateVerifyEmail(email: string, isEmailVerified: boolean): Promise<User> {
    const updatedUser = await this.userRepository.update(email, { isEmailVerified });
    if (!updatedUser) {
      throw new NotFoundException(`User with Email ${email} not found`);
    }
    return updatedUser;
  }
}
