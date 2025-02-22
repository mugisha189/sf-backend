import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { SavingProductModule } from './saving-product/saving-product.module';
import { PartnerCompanyModule } from './partner-company/partner-company.module';
import { CompanyProductsModule } from './company-products/company-products.module';
import { ProductPurchasesModule } from './product-purchases/product-purchases.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SeedsService } from './seeds/seeds.service';
import { SeedsModule } from './seeds/seeds.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/entity/users.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    EmailModule,
    SavingProductModule,
    PartnerCompanyModule,
    SeedsModule,
    CompanyProductsModule,
    // ProductPurchasesModule,
    CloudinaryModule,
    TypeOrmModule.forFeature([Users]),
  ],
  providers: [SeedsService]
})
export class AppModule {
  constructor(private readonly seedsService: SeedsService) { }

  async onModuleInit() {
    await this.seedsService.createSuperAdmin();
  }
}
