import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  nationalId: string;
}

export class AddMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  members: CreateUserDto[];
}
