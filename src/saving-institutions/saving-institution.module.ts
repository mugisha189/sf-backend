import { Module } from '@nestjs/common';
import { SavingInstitutionService } from './saving-institution.service';
import { SavingInstitutionController } from './saving-institution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingInstitution } from './entities/saving-institution.entity';
import { User } from 'src/users/entity/users.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EmailModule } from 'src/email/email.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavingInstitution, User]),
    CloudinaryModule,
    EmailModule,
    TokenModule,
  ],
  controllers: [SavingInstitutionController],
  providers: [SavingInstitutionService],
})
export class SavingInstitutionModule {}
