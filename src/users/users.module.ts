import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/users.entity';
import { TokenModule } from 'src/token/token.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SavingProduct } from 'src/saving-products/entities/saving-product.entity';
import { UserSubscription } from './entity/user-subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SavingProduct, UserSubscription]),
    TokenModule,
    CloudinaryModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
