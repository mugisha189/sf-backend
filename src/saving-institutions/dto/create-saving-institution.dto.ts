import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(16, 16, { message: 'National ID must be exactly 16 digits' })
  @IsNotEmpty()
  nationalId: string;
}

export class CreateSavingInstitutionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: () => AdminDto })
  @ValidateNested()
  @Type(() => AdminDto)
  @IsNotEmpty()
  admin: AdminDto;
}
