import { Controller, Post, Body, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './schemas/role.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles') // Thêm tag cho controller
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':name')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('name') name: string,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<Role> {
    return this.rolesService.updateByName(name, updateRoleDto);
  }
}
