import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
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
    @IsString()
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
    @IsString()
    @ApiProperty()
    entryPointChargeType: typeof CHARGE_TYPE

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    entryPointChargeValue: number

    



}
