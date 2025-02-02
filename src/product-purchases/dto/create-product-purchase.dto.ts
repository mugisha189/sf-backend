import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { COMPANY_TYPE } from "src/constants/constants";

export class CreateProductPurchaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    savingProductName: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    companyName: string

    @ApiProperty()
    @IsEnum(COMPANY_TYPE, { message: 'Company type must be either TELECOM,PETROL_STATIONS or SUPER_MARKET' })
    @IsNotEmpty()
    companyType: COMPANY_TYPE

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product: string

    @ApiProperty()
    @IsPositive()
    @IsNotEmpty()
    trxAmount: number

    @ApiProperty()
    @IsPositive()
    @IsNotEmpty()
    productAmount: number

    @ApiProperty()
    @IsPositive()
    @IsNotEmpty()
    sfAmount: number

    @ApiProperty()
    @IsPositive()
    @IsNotEmpty()
    ejoHezaAmount: number

    
}
