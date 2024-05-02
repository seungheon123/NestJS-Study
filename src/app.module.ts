import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { MemberModule } from './member/member.module';
import { BoardModule } from './board/board.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), MemberModule, BoardModule, CommentModule],
})
export class AppModule {}
