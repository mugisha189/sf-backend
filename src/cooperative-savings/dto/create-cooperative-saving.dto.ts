import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateCooperativeSavingsDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;
}
