// src/user/user.controller.ts
import { Controller, Post, Body, Put, Param, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../token/jwt-auth.guard';
import { use } from 'passport';
import { User } from './schemas/user.schema';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  

  @Put(':email')
  async update(
    @Param('email') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }









}  
//   @UseGuards(JwtAuthGuard)
//   @Post()
//   async create(@Body() createUserDto: CreateUserDto) {
//     return this.userService.create(createUserDto);
//   }

