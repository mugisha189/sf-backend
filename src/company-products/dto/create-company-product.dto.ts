import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCompanyProductDto {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    companyName: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    packageName: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    packageMaximumAmount: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    packageDescription: number

}
