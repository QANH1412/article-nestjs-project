import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesRepository {
  constructor(@InjectModel(Role.name) private readonly roleModel: Model<Role>) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = new this.roleModel(createRoleDto);
    return newRole.save();
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleModel.findById(id).exec();
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).exec();
  }

  async updateByName(name: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    return this.roleModel.findOneAndUpdate({ name }, updateRoleDto, { new: true }).exec();
  }
}
