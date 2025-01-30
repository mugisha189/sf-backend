import { Module } from '@nestjs/common';
import { SavingProductService } from './saving-product.service';
import { SavingProductController } from './saving-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingProduct } from './entities/saving-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavingProduct])
  ],
  controllers: [SavingProductController],
  providers: [SavingProductService],

})
export class SavingProductModule {}
