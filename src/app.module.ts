import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { SavingProductModule } from './saving-product/saving-product.module';
import { PartnerCompanyModule } from './partner-company/partner-company.module';
import { CompanyProductsModule } from './company-products/company-products.module';

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
    CompanyProductsModule,
  ],
})
export class AppModule {}
