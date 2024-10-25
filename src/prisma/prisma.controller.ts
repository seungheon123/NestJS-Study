import { Controller, Get, Post } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Controller("prisma")
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('/new')
  createUser() {
    return this.prismaService.member.create({
      data: {
        email: "test@gmail.com",
        name: "Test User",
      },
    });
  }

  @Get('/all')
  getAllUsers() {
    const members = this.prismaService.member.findMany();
    members.then((data) => {
      data.forEach((member) => {
        console.log(member.password);
      });
    })
    return members;
  }
}