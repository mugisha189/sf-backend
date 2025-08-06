import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { ServiceProviderModule } from './service-provider/service-provider.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SeedsService } from './seeds/seeds.service';
import { SeedsModule } from './seeds/seeds.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/users.entity';
import { SavingInstitutionModule } from './saving-institutions/saving-institution.module';
import { SavingProductModule } from './saving-products/saving-product.module';
import { UssdModule } from './ussd/ussd.module';
import { CooperativeModule } from './cooperative/cooperative.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    EmailModule,
    ServiceProviderModule,
    SavingInstitutionModule,
    SavingProductModule,
    CooperativeModule,
    SeedsModule,
    CloudinaryModule,
    TypeOrmModule.forFeature([User]),
    UssdModule,
  ],
  providers: [SeedsService],
})
export class AppModule {
  constructor(private readonly seedsService: SeedsService) {}

  async onModuleInit() {
    await this.seedsService.createSuperAdmin();
  }
}
