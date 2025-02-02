import { ApiProperty } from "@nestjs/swagger";
import { isEnum, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { CHARGE_TYPE, COMPANY_TYPE } from "src/constants/constants";


export class CreateSavingProductDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    savingProductName: string

    @IsNotEmpty()
    @IsEnum(COMPANY_TYPE, { message: 'Company type must be either TELECOM,PETROL_STATIONS or SUPER_MARKET' })
    @ApiProperty()
    companyType: COMPANY_TYPE

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    companyName: string


    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    productDescription: string

    @IsNotEmpty()
    @IsEnum(CHARGE_TYPE, { message: 'Charge type must be either PERCENTAGE or FIXED' })
    @ApiProperty()
    cashBackChargeType: CHARGE_TYPE

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    cashBackChargeValue: number

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    cashBackMinimumCash: number

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    cashBackMaximumCash: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    entryPointName: string

    @IsNotEmpty()
    @IsEnum(CHARGE_TYPE, { message: 'Charge type must be either PERCENTAGE or FIXED' })
    @ApiProperty()
    entryPointChargeType: CHARGE_TYPE

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    entryPointChargeValue: number

    



}
