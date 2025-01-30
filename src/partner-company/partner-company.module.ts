import { Module } from '@nestjs/common';
import { PartnerCompanyService } from './partner-company.service';
import { PartnerCompanyController } from './partner-company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerCompany } from './entities/partner-company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnerCompany])
  ],
  controllers: [PartnerCompanyController],
  providers: [PartnerCompanyService],
})
export class PartnerCompanyModule {}
