import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesRepository.create(createRoleDto);
  }

  async findById(id: string): Promise<Role | null> {
    return this.rolesRepository.findById(id);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findByName(name);
  }

  async updateByName(name: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const updatedRole = await this.rolesRepository.updateByName(name, updateRoleDto);
    if (!updatedRole) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return updatedRole;
  }
}
