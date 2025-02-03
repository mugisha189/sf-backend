import { Inject, Module } from '@nestjs/common';
import { PartnerCompanyService } from './partner-company.service';
import { PartnerCompanyController } from './partner-company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerCompany } from './entities/partner-company.entity';
import { Users } from 'src/users/entity/users.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnerCompany, Users]),
    CloudinaryModule
  ],
  controllers: [PartnerCompanyController],
  providers: [PartnerCompanyService],
  
})
export class PartnerCompanyModule {}
