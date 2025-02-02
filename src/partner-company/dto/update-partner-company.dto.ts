import { PartialType } from '@nestjs/swagger';
import { CreatePartnerCompanyDto } from './create-partner-company.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePartnerCompanyDto extends CreatePartnerCompanyDto{
    @IsString()
    @IsNotEmpty()
    companyAdminId: string
}
