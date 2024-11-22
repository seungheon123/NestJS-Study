import { Module } from '@nestjs/common';
import { GuardModule } from './guard/guard.module';
import { DynamicModuleModule } from './dynamic-module/dynamic-module.module';
import { ExceptionModule } from './exception/exception.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(typeORMConfig),
    // MemberModule,
    // BoardModule,
    // CommentModule,
    // RedisModule.forRoot({
    //   type: 'single',
    //   url: 'redis://localhost:6379',
    // }),
    RedisModule.forRoot(),
    GuardModule,
    DynamicModuleModule,
    ExceptionModule,
    PrismaModule,
    // HlsModule,
    ChatModule,
  ],
})
export class AppModule {}
