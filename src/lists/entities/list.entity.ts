import { TaskEntity } from 'src/tasks/entities/task.entity';
import { BaseEntity } from '../../config/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { IList } from '../interfaces/list.interface';
import { BoardEntity } from 'src/boards/entities/board.entity';

@Entity({ name: 'lists' })
export class ListEntity extends BaseEntity implements IList {
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => BoardEntity, (board) => board.lists)
  board: BoardEntity;

  @OneToMany(() => TaskEntity, (task) => task.list)
  tasks: TaskEntity[];
}
