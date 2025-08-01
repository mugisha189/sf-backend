import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateServiceProviderProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  min: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  max: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceProviderId?: string;
}
