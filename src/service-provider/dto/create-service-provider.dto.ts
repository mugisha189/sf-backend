import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceProviderCompanyType } from '../enums/service-provider-type.enum';

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

export class CreateServiceProviderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: ServiceProviderCompanyType,
    description: 'Must be one of: TELECOM, PETROL_STATIONS, SUPER_MARKET',
  })
  @IsEnum(ServiceProviderCompanyType, {
    message:
      'Company type must be either TELECOM, PETROL_STATIONS or SUPER_MARKET',
  })
  @IsNotEmpty()
  companyType: ServiceProviderCompanyType;

  @ApiProperty({ type: () => AdminDto })
  @ValidateNested()
  @Type(() => AdminDto)
  @IsNotEmpty()
  admin: AdminDto;
}
