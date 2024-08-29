import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';  // Decorator để xác định permissions yêu cầu
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RolesService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());
    
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userRole = await this.roleService.findById(user.roleId);

    const hasPermissons = requiredPermissions.every(permission => userRole.permissions.includes(permission));

    if (!hasPermissons) {
      throw new ForbiddenException(`Access denied: You do not have permissons to access to this route`);
    }
  }
}
