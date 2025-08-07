import {
  IsUUID,
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SavingProductType } from 'src/saving-products/enums/saving-product-type.enum';

export class CreateSavingDto {
  @ApiProperty({ enum: SavingProductType })
  @IsEnum(SavingProductType)
  type: SavingProductType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  savingProductId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  subProductId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shopCode?: string;
}
