import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';
import { CooperativeSavings } from './entities/cooperative-saving.entity';
import { UserCooperative } from 'src/users/entity/user-cooperative.entity';
import { CoopSavingsService } from './cooperative-savings.service';
import { CoopSavingsController } from './cooperative-savings.controller';
import { ContributionShareModule } from 'src/shared/contribution-share/contribution-share.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cooperative,
      CooperativeSavings,
      UserCooperative,
    ]),
    ContributionShareModule,
  ],
  providers: [CoopSavingsService],
  controllers: [CoopSavingsController],
})
export class CoopSavingsModule {}
