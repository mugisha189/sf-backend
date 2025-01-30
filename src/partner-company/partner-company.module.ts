import { Module } from '@nestjs/common';
import { PartnerCompanyService } from './partner-company.service';
import { PartnerCompanyController } from './partner-company.controller';

@Module({
  controllers: [PartnerCompanyController],
  providers: [PartnerCompanyService],
})
export class PartnerCompanyModule {}
