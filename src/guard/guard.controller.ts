import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./guard.auth";
import { Roles } from "./guard.decorator";
import { RolesGuard } from "./guard.roles";

@Controller('guard')
export class GuardController {
  @Get()
  @UseGuards(AuthGuard)
  test(){
    return "This action returns all guards";
  }

  @Get('roles')
  @Roles(['admin'])
  @UseGuards(RolesGuard)
  test2(){
    return "This action returns admin";
  }
}