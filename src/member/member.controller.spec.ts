import { Test } from "@nestjs/testing";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";

import {ModuleMocker, MockFunctionMetadata} from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('MemberController', ()=>{

    let controller: MemberController;
    beforeEach(async()=>{
        const module = await Test.createTestingModule({
            controllers: [MemberController],
        })
        .useMocker((token)=>{
            const result = ['test1', 'test2'];
            if(token === MemberService){
                return {
                    findByName: jest.fn().mockResolvedValue(result)
                }
            }
            if(token === 'function'){
                const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any,any>;
                const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                return new Mock();
            }
        })
        .compile();
        controller = module.get(MemberController);
    });

    it('MemberController should be defined', ()=>{
        expect(controller).toBeDefined();
    })

    it('findByName should return an array of string', async()=>{
        const result = await controller.findByName('test');
        expect(result).toEqual(['test1', 'test2']);
    })
})