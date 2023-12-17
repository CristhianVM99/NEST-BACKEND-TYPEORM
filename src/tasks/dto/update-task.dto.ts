import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { taskStatus } from '../interfaces/task.interface';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  listId: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsEnum(taskStatus)
  status: taskStatus;
}
