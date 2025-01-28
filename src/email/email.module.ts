import { Module, NotFoundException } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from 'src/otp/entity/otp.entity';
import { Users } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [EmailService],
  exports: [EmailService], //export for DI 
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],


      useFactory: (configService: ConfigService) => {
        const requiredEnvVars = [
          'EMAIL_HOST',
          'EMAIL_PORT',
          'EMAIL_SECURE',
          'GMAIL_SERVICE_AUTH_EMAIL',
          'GMAIL_SERVICE_AUTH_APP_PASSWORD',
          'EMAIL_FROM'
        ];

        for (const envVar of requiredEnvVars) {
          console.log(`${envVar} ${configService.get(envVar)}`);
          if (!configService.get(envVar)) {
            console.log(`Missing required environment variable ${envVar}`);
            throw new NotFoundException(`Missing required environment variable ${envVar}`)
          };
        }
        return {

          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            port: configService.get<number>('EMAIL_PORT'),
            secure: configService.get<boolean>('EMAIL_SECURE'), // true for 465, false for 587
            auth: {
              user: configService.get<string>('GMAIL_SERVICE_AUTH_EMAIL'),
              pass: configService.get<string>('GMAIL_SERVICE_AUTH_APP_PASSWORD'),
            },
            tls: {
              // Add tls for the security purposes
              rejectUnauthorized: true
            }
          },
          defaults: {
            from: `"Save for Future" <${configService.get<string>("EMAIL_FROM")}>`
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true
            }
          }
        }
      }
    }),
    TypeOrmModule.forFeature([OtpEntity, Users]),
    UsersModule

  ]
})
export class EmailModule { }
