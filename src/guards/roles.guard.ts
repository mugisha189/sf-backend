import {  CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from "src/constants/role.enum";
import { ROLE_KEY } from "src/decorators/roles.decorator";

@Injectable()

export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if(!requiredRoles)return true

        const {user} = context.switchToHttp().getRequest()
        const result =  requiredRoles.some((role)=> user.role.includes(role))

        if(!result) throw new ForbiddenException("Can't perform the action");

        return result

    }
}