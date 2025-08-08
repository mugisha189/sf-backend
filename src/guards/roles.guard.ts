import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/constants/role.enum';
import { ROLE_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles on each route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no required roles on a certain route, continue
    if (!requiredRoles) return true;

    // Get the user in request
    const { user } = context.switchToHttp().getRequest();
    // Check if the role of user aligns with required role
    const result = requiredRoles.some((role) => user.role.includes(role));

    // If user has no required role, no access
    if (!result) throw new ForbiddenException('Not authorized for this action');

    return true;
  }
}
