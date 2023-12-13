import { ListEntity } from 'src/lists/entities/list.entity';
import { BaseEntity } from '../../config/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { ITask, taskStatus } from '../interfaces/task.interface';

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity implements ITask {
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  dueDate: Date;
  @Column({ type: 'enum', enum: taskStatus })
  status: taskStatus;
  @ManyToOne(() => ListEntity, (list) => list.tasks)
  list: ListEntity;
}
