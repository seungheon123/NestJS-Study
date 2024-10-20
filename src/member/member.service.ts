import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { encodePassword } from 'src/utils/bcrypt';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(
    // @InjectRepository(Member)
    // private readonly memberRepository:Repository<Member>,
    private readonly memberRepository: MemberRepository,
  ){}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const password = encodePassword(createMemberDto.password);
    const existMember = await this.memberRepository.findByName(createMemberDto.name);
    if(existMember){
      throw new ConflictException('중복되는 이름입니다.');
    }
    const newMember = this.memberRepository.create({ ...createMemberDto, password});
    return this.memberRepository.save(newMember);
  }
  async findByName(name: string): Promise<Member> {
    return this.memberRepository.findByName(name);
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }
}
