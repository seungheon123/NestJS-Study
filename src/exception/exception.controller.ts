import { Controller, Get, UseFilters } from "@nestjs/common";
import { ForbiddenException } from "./exception.forbidden";
import { HttpExceptionFilter } from "./exception.filter";

@Controller('exception')
export class ExceptionController {

  @Get()
  @UseFilters( HttpExceptionFilter)
  async create() {
    throw new ForbiddenException();
  }
}