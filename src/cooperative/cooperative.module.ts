import { Module } from '@nestjs/common';
import { CooperativeService } from './cooperative.service';
import { CooperativeController } from './cooperative.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cooperative } from './entities/cooperative.entity';
import { User } from 'src/users/entity/users.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EmailModule } from 'src/email/email.module';
import { TokenModule } from 'src/token/token.module';
import { UserCooperative } from 'src/users/entity/user-cooperative.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cooperative, UserCooperative, User]),
    CloudinaryModule,
    EmailModule,
    TokenModule,
  ],
  controllers: [CooperativeController],
  providers: [CooperativeService],
})
export class CooperativeModule {}
