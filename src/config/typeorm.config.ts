import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from "dotenv";
import { Board } from 'src/board/entities/board.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Member } from 'src/member/entities/member.entity';

dotenv.config();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: process.env.DB_PASS,
  database: 'nest',
  entities: [Member, Board, Comment],
  synchronize: true,
  //autoLoadEntities: true,
  logging: true,
};
