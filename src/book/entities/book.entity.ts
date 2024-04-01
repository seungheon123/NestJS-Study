import { Member } from "src/member/entities/member.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(()=>Member, member => member.books)
    @JoinColumn({name: 'member_id'})
    member: Member;
}
