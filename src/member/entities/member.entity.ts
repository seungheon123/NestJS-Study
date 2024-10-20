import { Board } from 'src/board/entities/board.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { CommonEntity } from 'src/common/common.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Member extends CommonEntity {
  @PrimaryGeneratedColumn({name:'member_id'})
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(()=>Board, (board)=>board.member)
  boards: Board[]

  @OneToMany(()=>Comment, (comment)=>comment.member)
  comments: Comment[]
  
  // static findByName(name: string){
  //   return this.createQueryBuilder("member")
  //     .where("member.name=:name",{name})
  //     .getOne()
  // }
}
