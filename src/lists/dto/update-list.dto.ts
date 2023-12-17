import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateListDto {
  @IsNotEmpty()
  @IsString()
  boardId: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  readonly tasksIds: string[];
}
