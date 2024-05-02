import { BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class CommonEntity extends BaseEntity{
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp', nullable:true})
    updatedAt: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleteAt: Date;

}