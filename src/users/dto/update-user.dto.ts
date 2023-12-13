import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EGender } from '../interfaces/user.inteface';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  password: string;

  @IsEnum(EGender)
  @IsOptional()
  gender: EGender;

  @IsOptional()
  @IsArray()
  readonly boardsIds: string[];
}
