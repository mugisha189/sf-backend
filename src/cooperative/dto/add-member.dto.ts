import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @IsNumber()
  @IsNotEmpty()
  contributionAmount: number;
}

export class AddMembersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  members: CreateUserDto[];
}
