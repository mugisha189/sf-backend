import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { COMPANY_TYPE } from "src/constants/constants";

export class CreateCompanyProductDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
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
