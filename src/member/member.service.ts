import { Inject, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { encodePassword } from 'src/utils/bcrypt';
import { MEMBER_REPOSITORY, MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(
    // @InjectRepository(Member)
    // private readonly memberRepository:Repository<Member>,
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
  ){}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const password = encodePassword(createMemberDto.password);
    const newMember = this.memberRepository.create({ ...createMemberDto, password});
    return this.memberRepository.save(newMember);
  }

  // async findAll() : Promise<Member[]> {
  //   const result = await this.memberRepository.find({});
  //   console.log('result',result)
  //   return result;
  // }

  // async findOne(id: number) :Promise<Member> {
  //   return this.memberRepository
  //     .createQueryBuilder('member')
  //     .leftJoinAndSelect('member.boards', 'board')
  //     .leftJoinAndSelect('member.comments','comment')
  //     .where('member.id=:id', {id})
  //     .getOne();
  // }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
