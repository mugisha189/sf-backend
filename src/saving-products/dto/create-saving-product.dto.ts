import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SavingProductType } from '../enums/saving-product-type.enum';

export class CreateSavingProductDto {
  @ApiProperty({ description: 'Name of the saving product' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the saving product',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: SavingProductType,
    description: 'Must be one of: ',
  })
  @IsEnum(SavingProductType, {
    message: 'Company type must be either ',
  })
  @IsNotEmpty()
  type: SavingProductType;

  @ApiPropertyOptional({ description: 'Optional ID of the service provider' })
  @IsOptional()
  @IsUUID()
  serviceProviderId?: string;

  @ApiProperty({
    description: 'Service provider dividend (0-100)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  serviceProviderDividend: number;

  @ApiProperty({ description: 'SF dividend (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  sfDividend: number;

  @ApiProperty({
    description: 'Saving product dividend (0-100)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  savingInstitutionDividend: number;

  @ApiProperty({ description: 'ID of the saving institution' })
  @IsUUID()
  savingInstitutionId: string;
}
