import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty()
  @IsString()
  boardId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  readonly tasksIds: string[];
}
