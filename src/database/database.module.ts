import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProduct } from 'src/company-products/entities/company-product.entity';
import { ConfirmationToken } from 'src/confirmationToken/entity/token.entity';
import { OtpEntity } from 'src/otp/entity/otp.entity';
import { PartnerCompany } from 'src/partner-company/entities/partner-company.entity';
import { ProductPurchase } from 'src/product-purchases/entities/product-purchase.entity';
import { SavingProduct } from 'src/saving-product/entities/saving-product.entity';
import { Users } from 'src/users/entity/users.entity';
@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService)=>({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: configService.get('DATABASE_PORT'),
                password: configService.get('DATABASE_PASSWORD'),
                username: configService.get('DATABASE_USER'),
                entities: [Users, OtpEntity, ConfirmationToken, CompanyProduct, PartnerCompany, SavingProduct, ProductPurchase],
                // entities: [__dirname + '/../**/*.entity{.ts}'],
                database: configService.get('DATABASE_NAME'),
                synchronize: false,
                logging: true,
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}
