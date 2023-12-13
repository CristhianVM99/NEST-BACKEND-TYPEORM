import { IsOptional, IsString } from 'class-validator';

export class UpdateListDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
