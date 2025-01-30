import { PartialType } from '@nestjs/swagger';
import { CreatePartnerCompanyDto } from './create-partner-company.dto';

export class UpdatePartnerCompanyDto extends PartialType(CreatePartnerCompanyDto) {}
