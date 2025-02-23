import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { COMPANY_TYPE } from "src/constants/constants";

export class CreateCompanyProductDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    companyId: string


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    maximumAmount: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    minimumAmount: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

}
