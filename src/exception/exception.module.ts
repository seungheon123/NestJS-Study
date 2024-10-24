import { Module } from "@nestjs/common";
import { ExceptionController } from "./exception.controller";
import { HttpExceptionFilter } from "./exception.filter";

@Module({
  controllers: [ExceptionController],
  // providers: [HttpExceptionFilter]
})
export class ExceptionModule {}