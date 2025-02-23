import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '../otp/entity/otp.entity';
import { EmailModule } from 'src/email/email.module';
import { TokenModule } from 'src/token/token.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '6000s' }
    }),

    TypeOrmModule.forFeature([OtpEntity]),
    EmailModule,
    TokenModule,


  ]
})
export class AuthModule { }
