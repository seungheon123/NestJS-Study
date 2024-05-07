import { DataSource, Repository } from "typeorm";
import { Member } from "./entities/member.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMemberDto } from "./dto/create-member.dto";
import { MemberRepository } from "./member.repository";

@Injectable()
export class MemberRepositoryImpl implements MemberRepository{
    private memberRepository: Repository<Member>;
    constructor(private readonly dataSource: DataSource){
        this.memberRepository = this.dataSource.getRepository(Member);
    }

    create(createMemberDto: CreateMemberDto): Member{
        return this.memberRepository.create(createMemberDto);
    }

    save(member: Member): Promise<Member>{
        return this.memberRepository.save(member);
    }

}