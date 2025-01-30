import { Module } from '@nestjs/common';
import { CompanyProductsService } from './company-products.service';
import { CompanyProductsController } from './company-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProduct } from './entities/company-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyProduct])],
  controllers: [CompanyProductsController],
  providers: [CompanyProductsService],
})
export class CompanyProductsModule {}
