import { Test } from "@nestjs/testing"
import { MemberService } from "./member.service";
import { find } from "rxjs";
import { MemberRepository } from "./member.repository";
import { Member } from "./entities/member.entity";
import { CreateMemberDto } from "./dto/create-member.dto";

describe('MemberService', ()=>{
    let service: MemberService;

    const members:Member[] = [];

    beforeEach(async()=>{
        //Create a fake copy of the memberRepsoitory
        const fakeMemberRepository: Partial<MemberRepository> = {
            create: (createMemberDto: CreateMemberDto) => (
                {name: createMemberDto.name, email:createMemberDto.email, password:createMemberDto.password} as Member
            ),
            save: (member:Member) => {
                const user = {
                    id: 1, 
                    name: member.name, 
                    password: member.password, 
                    email:member.email
                } as Member;
                members.push(user);
                return Promise.resolve(user);
            },
            findByName: (name: String) => {
                const filterMember = members.filter((member)=>member.name === name);
                return Promise.resolve(filterMember[0]);
            },
        }
    
        const module = await Test.createTestingModule({
            providers: [
                MemberService,
                {
                    provide: MemberRepository,
                    useValue: fakeMemberRepository
                }
            ]
        }).compile();
    
        service = module.get(MemberService);
    });
    
    it('can create an inastance of MemberService', async()=>{
        expect(service).toBeDefined();
    })

    it('find a user by name', async()=>{
        const dto: CreateMemberDto = {
            "name" : "test",
            "email" : "email",
            "password" : "password" 
        }
        await service.create(dto);
        const result = await service.findByName('test');
        expect(result.name).toEqual('test');
    })

    it('can create a new member', async()=>{
        const dto: CreateMemberDto = {
            "name" : "test1",
            "email" : "email1",
            "password" : "password" 
        }
        const result = await service.create(dto);
        expect(result.name).toEqual("test1");
        expect(result.email).toEqual("email1");        
    })

    it('can not create a new member with the same name', async()=>{
        const dto: CreateMemberDto = {
            "name" : "test",
            "email" : "email",
            "password" : "password" 
        }
        try{
            await service.create(dto);
        }catch(e){
            expect(e.message).toEqual('중복되는 이름입니다.');
        }
    })

});
