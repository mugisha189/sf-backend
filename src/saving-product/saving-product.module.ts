import { Module } from '@nestjs/common';
import { SavingProductService } from './saving-product.service';
import { SavingProductController } from './saving-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingProduct } from './entities/saving-product.entity';
import { EntryPoint } from './entities/entry-points.entity';
import { PartnerCompany } from 'src/partner-company/entities/partner-company.entity';
import { CompanyProduct } from 'src/company-products/entities/company-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavingProduct, EntryPoint, PartnerCompany, CompanyProduct])
  ],
  controllers: [SavingProductController],
  providers: [SavingProductService],

})
export class SavingProductModule { }
