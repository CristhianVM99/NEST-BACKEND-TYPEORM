import { TaskEntity } from 'src/tasks/entities/task.entity';
import { BaseEntity } from '../../config/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { IList } from '../interfaces/list.interface';
import { BoardEntity } from 'src/boards/entities/board.entity';

@Entity({ name: 'lists' })
export class ListEntity extends BaseEntity implements IList {
  @Column({ type: 'varchar', length: '255' })
  title: string;

  @Column({ type: 'varchar', length: '255' })
  description: string;

  @ManyToOne(() => BoardEntity, (board) => board.lists, {
    onDelete: 'CASCADE',
  })
  board: BoardEntity;

  @OneToMany(() => TaskEntity, (task) => task.list, { onDelete: 'CASCADE' })
  tasks: TaskEntity[];
}
