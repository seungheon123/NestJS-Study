import { CanActivate, Injectable } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { Reflector } from "@nestjs/core";
import { Roles } from "./guard.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('request validated');
    return true;
  }

}
