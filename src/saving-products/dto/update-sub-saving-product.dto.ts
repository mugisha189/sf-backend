import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateSubSavingProductDto {
  @ApiPropertyOptional({
    description: 'Title of the sub saving product',
    example: 'Student Monthly Saver',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional({
    description: 'Amount',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount: number;
}
