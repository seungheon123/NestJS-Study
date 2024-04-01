import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ){}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const newMember = this.memberRepository.create(createMemberDto);
    return this.memberRepository.save(newMember);
  }

  findAll() {
    return `This action returns all member`;
  }

  async findOne(id: number) :Promise<Member> {
    return this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.books', 'book')
      .where('member.id=:id', {id})
      .getOne();
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
