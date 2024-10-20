import { DataSource, EntityRepository, Repository } from "typeorm";
import { Member } from "./entities/member.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMemberDto } from "./dto/create-member.dto";

@Injectable()
export class MemberRepository{
    private memberRepository: Repository<Member>;
    constructor(private readonly dataSource: DataSource){
        this.memberRepository = this.dataSource.getRepository(Member);
    }

    create(createMemberDto: CreateMemberDto): Member{
        return this.memberRepository.create(createMemberDto);
    }

    async save(member: Member): Promise<Member>{
        return this.memberRepository.save(member);
    }

    async findByName(name: string): Promise<Member>{
        return this.memberRepository.findOne({where: {name}});
    }
}