// src/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { CreateOauth2UserDto } from './dto/create-Oauth2-user.dto';


@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  async createOauth2(createOauth2UserDto: CreateOauth2UserDto): Promise<User> {
    return this.userRepository.createOauth2(createOauth2UserDto);
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
