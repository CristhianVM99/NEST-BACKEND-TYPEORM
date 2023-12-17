import { BaseEntity } from '../../config/base.entity';
import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { IBoard } from '../interfaces/board.interface';
import { ListEntity } from 'src/lists/entities/list.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Entity({ name: 'boards' })
export class BoardEntity extends BaseEntity implements IBoard {
  @Column({ type: 'varchar', length: '255' })
  title: string;
  @Column({ type: 'varchar', length: '255' })
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.boards, { onDelete: 'CASCADE' })
  users: UserEntity[];

  @OneToMany(() => ListEntity, (list) => list.board, { onDelete: 'CASCADE' })
  lists: ListEntity[];
}
