import { DataSource, Repository } from "typeorm";
import { Member } from "./entities/member.entity";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class MemberRepository extends Repository<Member>{
    constructor(private readonly datasource: DataSource){
        
        super(Member, datasource.createEntityManager());
    }

    async getMemberById(id: number): Promise<Member>{
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const found = await this.findOneBy({'id':id});
        if(!found){
            throw new NotFoundException(`Can't find member with id" ${id}`);
        }
        return found;
    }


}