import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsNotEmpty()
  @IsArray()
  readonly usersIds: string[];

  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  readonly listsIds: string[];
}
