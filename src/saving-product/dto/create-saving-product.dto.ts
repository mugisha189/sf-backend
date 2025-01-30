import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNegative, IsNotEmpty, IsString } from "class-validator";
import { CHARGE_TYPE } from "src/constants/constants";


export class CreateSavingProductDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    savingProductName: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    companyName: string


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    productDescription: string

    @IsNotEmpty()
    @IsEnum(CHARGE_TYPE)
    @ApiProperty()
    cashBackChargeType: typeof CHARGE_TYPE

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    cashBackChargeValue: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    cashBackMinimumCash: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    cashBackMaximumCash: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    entryPointName: number

    @IsNotEmpty()
    @IsEnum(CHARGE_TYPE)
    @ApiProperty()
    entryPointChargeType: typeof CHARGE_TYPE

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    entryPointChargeValue: number

    



}
