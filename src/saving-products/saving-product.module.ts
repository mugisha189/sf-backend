import { Module } from '@nestjs/common';
import { SavingProductService } from './saving-product.service';
import { SavingProductController } from './saving-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingProduct } from './entities/saving-product.entity';
import { User } from 'src/users/entity/users.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EmailModule } from 'src/email/email.module';
import { TokenModule } from 'src/token/token.module';
import { ServiceProviderProduct } from 'src/service-provider-products/entities/service-provider-product.entity';
import { SavingInstitution } from 'src/saving-institutions/entities/saving-institution.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SavingProduct,
      ServiceProviderProduct,
      SavingInstitution,
      User,
    ]),
    CloudinaryModule,
    EmailModule,
    TokenModule,
  ],
  controllers: [SavingProductController],
  exports: [SavingProductService],
  providers: [SavingProductService],
})
export class SavingProductModule {}
