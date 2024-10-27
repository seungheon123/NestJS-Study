import { Member } from "@prisma/client";

export class FindbyDto {
  id: number;
  constructor(member: Member) {
    this.id = member.id
  }
}