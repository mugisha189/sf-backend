import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateSubSavingProductDto {
  @ApiProperty({
    description: 'Title of the sub saving product',
    example: 'Student Monthly Saver',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Amount',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}
