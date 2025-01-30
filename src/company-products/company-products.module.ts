import { Module } from '@nestjs/common';
import { CompanyProductsService } from './company-products.service';
import { CompanyProductsController } from './company-products.controller';

@Module({
  controllers: [CompanyProductsController],
  providers: [CompanyProductsService],
})
export class CompanyProductsModule {}
