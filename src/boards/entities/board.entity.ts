import { BaseEntity } from '../../config/base.entity';
import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { IBoard } from '../interfaces/board.interface';
import { ListEntity } from 'src/lists/entities/list.entity';
import { UsersEntity } from 'src/users/entities/user.entity';

@Entity({ name: 'boards' })
export class BoardEntity extends BaseEntity implements IBoard {
  @Column()
  title: string;
  @Column()
  description: string;

  @ManyToMany(() => UsersEntity, (user) => user.boards)
  users: UsersEntity[];

  @OneToMany(() => ListEntity, (list) => list.board)
  lists: ListEntity[];
}
