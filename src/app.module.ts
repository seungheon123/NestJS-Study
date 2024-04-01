import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { MemberModule } from './member/member.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), MemberModule, BookModule],
})
export class AppModule {}
