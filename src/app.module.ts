import { Module } from '@nestjs/common';
import { GuardModule } from './guard/guard.module';
import { DynamicModuleModule } from './dynamic-module/dynamic-module.module';
import { ExceptionModule } from './exception/exception.module';
import { PrismaModule } from './prisma/prisma.module';
import { HlsModule } from './hls/hls.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    // TypeOrmModule.forRoot(typeORMConfig),
    // MemberModule,
    // BoardModule,
    // CommentModule,
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
    GuardModule,
    DynamicModuleModule,
    ExceptionModule,
    PrismaModule,
    HlsModule,
  ],
})
export class AppModule {}
