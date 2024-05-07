import { Injectable } from "@nestjs/common";
import { Member } from "./entities/member.entity";
import { CreateMemberDto } from "./dto/create-member.dto";

export const MEMBER_REPOSITORY = "Member Repository"

export interface MemberRepository{
    create(createMemberDto: CreateMemberDto):Member ;
    save(member: Member): Promise<Member>;
}