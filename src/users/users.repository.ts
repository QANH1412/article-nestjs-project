// src/users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository } from './interfaces/user-repository.interface';
import { User, UserDocument } from './schemas/user.schema';
import { CreateOauth2UserDto } from './dto/create-Oauth2-user.dto';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(userData: CreateUserDto): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async createOauth2(userData: CreateOauth2UserDto): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateLastActivity(username: string): Promise<void> {
    await this.userModel.updateOne(
      { username },
      { $set: { lastActivity: new Date() } },
    ).exec();
  }

  async update(email: string, updateFields: Partial<User>): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ email }, updateFields).exec(); 
  }
}
