import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, isEnum, IsNotEmpty, IsString } from "class-validator"
import { COMPANY_TYPE, PARTNERSHIP_TYPE } from "src/constants/constants"

export class CreatePartnerCompanyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    companyName: string

    @ApiProperty()
    @IsEnum(COMPANY_TYPE, { message: 'Company type must be either TELECOM,PETROL_STATIONS or SUPER_MARKET' })
    @IsNotEmpty()
    companyType: COMPANY_TYPE

    @ApiProperty()
    @IsEnum(PARTNERSHIP_TYPE)
    @IsNotEmpty()
    partnershipType: PARTNERSHIP_TYPE

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    adminFirstName: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    adminLastName: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    adminPhoneNumber: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    adminEmail: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    adminNationalId: string

}
