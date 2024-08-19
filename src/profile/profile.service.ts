// src/profile/profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Import UserService
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersService.findById(id); // Sử dụng findById từ UserService
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
