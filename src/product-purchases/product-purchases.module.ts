import { Module } from '@nestjs/common';
import { ProductPurchasesService } from './product-purchases.service';
import { ProductPurchasesController } from './product-purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPurchase } from './entities/product-purchase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductPurchase])
  ],
  controllers: [ProductPurchasesController],
  providers: [ProductPurchasesService],
})
export class ProductPurchasesModule {}
