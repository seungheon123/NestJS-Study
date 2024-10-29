import { Controller, Get, Param, Post } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { FindbyDto } from "./findby.dto";

@Controller("prisma")
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('/new')
  async createUser() {
    return this.prismaService.create();
  }

  @Get('/all')
  async getAllUsers() {
    const members =await  this.prismaService.findMany();
    return members;
  }

  @Get('/find/:id')
  async getUserById(@Param('id') id: string) {
    const memberId = parseInt(id);
    const member = await this.prismaService.findById(memberId);
    return new FindbyDto(member);
  }

  @Get('/test')
  async test() {
    return this.prismaService.withTransaction();
  }

  @Get('/test2')
  async test2() {
    return this.prismaService.withoutTransaction();
  }

  @Get("/boards")
  async getBoards() {
    return this.prismaService.getBoards();
  }

  @Get("/boards-member")
  async getBoardsWithMembers() {
    return this.prismaService.getBoardsWithMember();
  }
}