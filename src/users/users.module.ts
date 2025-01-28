import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { ConfirmationTokenModule } from 'src/confirmationToken/confirmToken.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), ConfirmationTokenModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
