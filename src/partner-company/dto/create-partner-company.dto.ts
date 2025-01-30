import { IsEnum, isEnum, IsNotEmpty, IsString } from "class-validator"
import { COMPANY_TYPE } from "src/constants/constants"

export class CreatePartnerCompanyDto {
    @IsString()
    @IsNotEmpty()
    companyName: string

    @IsEnum(COMPANY_TYPE)
    @IsNotEmpty() 
    companyType: keyof typeof COMPANY_TYPE

    @IsString()
    @IsNotEmpty()
    adminFirstName: string

    @IsString()
    @IsNotEmpty() 
    adminLastName: string

    @IsString()
    @IsNotEmpty() 
    adminPhoneNumber: string

    @IsString()
    @IsNotEmpty() 
    adminEmail: string

}
