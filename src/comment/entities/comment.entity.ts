import { Board } from "src/board/entities/board.entity";
import { CommonEntity } from "src/common/common.entity";
import { Member } from "src/member/entities/member.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment extends CommonEntity {
    @PrimaryGeneratedColumn({name:'comment_id'})
    id: number;

    @Column()
    content:string;

    @ManyToOne(()=>Member, (member)=>member.comments)
    @JoinColumn({name:'writer', referencedColumnName:'id'})
    member: Member;
    
    @ManyToOne(()=>Board, (board)=>board.comments)
    @JoinColumn({name:'board', referencedColumnName:'id'})
    board: Board;
    
    @ManyToOne(()=>Comment, (parent)=>parent.children)
    @JoinColumn({name:'parent',referencedColumnName:'id'})
    parent!: Comment;

    @OneToMany(()=>Comment, (children)=>children.parent)
    children!: Comment[];
}
