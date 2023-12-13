import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { taskStatus } from '../interfaces/task.interface';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @IsNotEmpty()
  @IsEnum(taskStatus)
  status: taskStatus;
}
