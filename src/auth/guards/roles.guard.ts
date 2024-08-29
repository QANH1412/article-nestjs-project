import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';  // Decorator để xác định roles yêu cầu
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RolesService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userRole = await this.roleService.findById(user.roleId);

    // Kiểm tra nếu role của người dùng có nằm trong danh sách các role yêu cầu
    if (!requiredRoles.includes(userRole.name)) {
        throw new ForbiddenException('Access denied: You do not have access to this route.');
      }
  
      return true; // Người dùng có quyền truy cập
  }
}
