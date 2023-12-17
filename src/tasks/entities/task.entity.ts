import { ListEntity } from 'src/lists/entities/list.entity';
import { BaseEntity } from '../../config/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { ITask, taskStatus } from '../interfaces/task.interface';

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity implements ITask {
  @Column({ type: 'varchar', length: '255' })
  title: string;
  @Column({ type: 'varchar', length: '255' })
  description: string;
  @Column({ type: 'date' })
  dueDate: Date;
  @Column({ type: 'enum', enum: taskStatus })
  status: taskStatus;
  @ManyToOne(() => ListEntity, (list) => list.tasks, {
    onDelete: 'CASCADE',
  })
  list: ListEntity;
}
