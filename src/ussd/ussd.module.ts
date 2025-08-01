import { Module } from '@nestjs/common';
import { UssdService } from './ussd.service';
import { UssdController } from './ussd.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { SavingProductModule } from 'src/saving-products/saving-product.module';

@Module({
  controllers: [UssdController],
  providers: [UssdService],
  imports: [UsersModule, AuthModule, SavingProductModule],
})
export class UssdModule {}
