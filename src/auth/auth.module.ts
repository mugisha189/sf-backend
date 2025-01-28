import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import {  jwtConstants } from '../constants/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '../otp/entity/otp.entity';
import { EmailModule } from 'src/email/email.module';
import { ConfirmationTokenModule } from 'src/confirmationToken/confirmToken.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '300s'}
    }), 

    TypeOrmModule.forFeature([OtpEntity]),
    EmailModule,
    ConfirmationTokenModule
    
  ]
})
export class AuthModule {}
