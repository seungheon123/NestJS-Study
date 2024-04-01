import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { Member } from 'src/member/entities/member.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ){}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const member = await this.memberRepository.findOneBy({username: createBookDto.author});
    if(!member) {
      throw new Error(`Member with name ${createBookDto.author} not found`);
    }
    const book = new Book();
    book.member = member;
    book.name = createBookDto.name;
    return await this.bookRepository.save(book);
  }

  findAll() {
    return `This action returns all book`;
  }

  async findOne(id: number): Promise<Book> {
    return this.bookRepository.findOneBy({id: id});
    // return this.bookRepository.findOne({
    //   where: {id: id},
    //   relations: ['member'],
    // })
    // return this.bookRepository
    //   .createQueryBuilder('book')
    //   .leftJoinAndSelect('book.member', 'member')
    //   .where('book.id=:id',{id})
    //   .getOne();
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
