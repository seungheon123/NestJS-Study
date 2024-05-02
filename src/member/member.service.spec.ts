import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptUtils from "../../src/utils/bcrypt"
import { MemberRepository } from './member.repository';

describe('MemberService', () => {
  let service: MemberService;
  let repository: Repository<Member>;

  beforeEach(async()=>{
    const module: TestingModule = await Test.createTestingModule({
      providers:[MemberService,
        {
          provide: getRepositoryToken(Member),
          useValue:{
            create: jest.fn(),
            save: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });
  
  it('service should be defined', ()=>{
    expect(service).toBeDefined();
  })

  it('repository should be defined', ()=>{
    expect(repository).toBeDefined();
  })

  describe('create()',()=>{
    jest
      .spyOn(bcryptUtils, 'encodePassword')
      .mockReturnValue('hashed123');

    it("should encode password", async()=>{
      await service.create({
        name: 'test',
        email: 'test@gmail.com',
        password: '123',
      });

      expect(bcryptUtils.encodePassword).toHaveBeenCalledWith('123');
    });

    it("should call userRepository.create with correct params", async()=>{
      await service.create({
        name: 'test',
        email: 'test@gmail.com',
        password: '123',
      });
      expect(repository.create).toHaveBeenCalledWith({
        name: 'test',
        email: 'test@gmail.com',
        password: 'hashed123',
      });
    })
  })

});
