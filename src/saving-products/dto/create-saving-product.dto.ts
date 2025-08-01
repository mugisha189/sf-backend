import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    description: 'Cash back percentage (0-100)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  cashBackPercentage: number;

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
  savingProductDividend: number;

  @ApiProperty({ description: 'ID of the saving institution' })
  @IsUUID()
  savingInstitutionId: string;

  @ApiPropertyOptional({
    description: 'ID of the service provider product (optional)',
  })
  @IsOptional()
  @IsUUID()
  serviceProviderProductId?: string;
}
