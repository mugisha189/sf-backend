import { Module } from '@nestjs/common';
import { CompanyProductsService } from './company-products.service';
import { CompanyProductsController } from './company-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProduct } from './entities/company-product.entity';
import { PartnerCompany } from 'src/partner-company/entities/partner-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerCompany, CompanyProduct])],
  controllers: [CompanyProductsController],
  providers: [CompanyProductsService],
})
export class CompanyProductsModule { }
