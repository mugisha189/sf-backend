import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/token/entity/token.entity';
import { OtpEntity } from 'src/otp/entity/otp.entity';
import { ServiceProvider } from 'src/service-provider/entities/service-provider.entity';
import { User } from 'src/users/entity/users.entity';
import { SavingInstitution } from 'src/saving-institutions/entities/saving-institution.entity';
import { SavingProduct } from 'src/saving-products/entities/saving-product.entity';
import { UserSubscription } from 'src/users/entity/user-subscription.entity';
import { SubSavingProduct } from 'src/saving-products/entities/sub-saving-product.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        password: configService.get('DATABASE_PASSWORD'),
        username: configService.get('DATABASE_USER'),
        entities: [
          User,
          OtpEntity,
          Token,
          ServiceProvider,
          SavingInstitution,
          SavingProduct,
          SubSavingProduct,
          UserSubscription,
        ],
        // entities: [__dirname + '/../**/*.entity{.ts}'],
        database: configService.get('DATABASE_NAME'),
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
