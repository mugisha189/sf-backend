import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfirmationToken } from 'src/confirmationToken/entity/token.entity';
import { OtpEntity } from 'src/otp/entity/otp.entity';
import { Users } from 'src/users/entity/user.entity';

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
                entities: [Users, OtpEntity, ConfirmationToken],
                // entities: [__dirname + '/../**/*.entity{.ts}'],
                database: configService.get('DATABASE_NAME'),
                synchronize: true,
                logging: true,
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}
