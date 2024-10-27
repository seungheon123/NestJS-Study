import { Module } from '@nestjs/common';
import { PrismaController } from "./prisma.controller";
import { PrismaService } from "./prisma.service";
import { PrismaRepository } from "./prisma.repository";

@Module({
  controllers: [PrismaController],
  providers: [PrismaService, PrismaRepository]
})
export class PrismaModule {}
