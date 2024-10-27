import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "./prisma.repository";
import { Member } from "@prisma/client";

@Injectable()
export class PrismaService{
  constructor(private readonly prismaRepository: PrismaRepository) {}

  async findMany(): Promise<Member[]> {
    return this.prismaRepository.member.findMany();
  }

  async findById(id: number) : Promise<Member|null> {
    return this.prismaRepository.member.findUnique({
      where: {
        id: id
      }
    });
  }

  async create(): Promise<Member> {
    return this.prismaRepository.member.create({
      data: {
        email: "test@gmail.com",
        name: "Test User",
      },
    });
  }

  async withTransaction() {
    await this.prismaRepository.$transaction(async (prisma) => {
      await prisma.member.update({
        where: {
          id: 1
        },
        data: {
          email: "test2@gmail.com"
        }
      });
      await prisma.member.update({
        where: {
          id: 2
        },
        data: {
          email: "test3@gmail.com"
        }
      });
    })
  }

  async withoutTransaction() {
    await this.prismaRepository.member.update({
      where: {
        id: 1
      },
      data: {
        email: "test2@gmail.com"
      }
    });
    await this.prismaRepository.member.update({
      where: {
        id: 2
      },
      data: {
        email: "test3@gmail.com"
      }
    });
  }
}