import { Comment } from "src/comment/entities/comment.entity";
import { CommonEntity } from "src/common/common.entity";
import { Member } from "src/member/entities/member.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Board extends CommonEntity {

    @PrimaryGeneratedColumn({name:'board_id'})
    id:number;

    @Column()
    title:string;

    @Column()
    content:string;

    @Column()
    likes: number;

    @Column()
    views: number;


    @ManyToOne(()=>Member, (member)=>member.boards)
    @JoinColumn({name:'writer',referencedColumnName:'id'})
    member: Member;

    @OneToMany(()=>Comment, (comment)=>comment.board)
    comments: Comment[];

}
