import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { MemberRepositoryImpl } from './member.repositoryImpl';
import { MEMBER_REPOSITORY } from './member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [
    MemberService,
    {
      provide: MEMBER_REPOSITORY,
      useClass: MemberRepositoryImpl
    }
  ],
})
export class MemberModule {}
