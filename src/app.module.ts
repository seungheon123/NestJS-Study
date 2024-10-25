import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { MemberModule } from './member/member.module';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';
import { GuardModule } from './guard/guard.module';
import { DynamicModuleModule } from './dynamic-module/dynamic-module.module';
import { ExceptionModule } from "./exception/exception.module";
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(typeORMConfig),
    // MemberModule,
    // BoardModule,
    // CommentModule,
    GuardModule,
    DynamicModuleModule,
    ExceptionModule,
    PrismaModule
  ],
})
export class AppModule {}
