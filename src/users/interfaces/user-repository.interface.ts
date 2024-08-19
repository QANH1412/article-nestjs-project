// src/users/interfaces/user-repository.interface.ts
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schemas/user.schema';

export interface IUserRepository {
  create(userData: CreateUserDto): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, userData: Partial<UpdateUserDto>): Promise<User | null>;
}
