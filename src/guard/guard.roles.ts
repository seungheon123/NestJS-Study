import { CanActivate, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { Roles } from "./guard.decorator";
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get(Roles, context.getHandler());
    console.log(roles);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const user = request.user;
    console.log(user);
  }
}