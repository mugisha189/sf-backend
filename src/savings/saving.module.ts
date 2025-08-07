import { Module } from '@nestjs/common';
import { SavingService } from './saving.service';
import { SavingController } from './saving.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './entities/saving.entity';
import { User } from 'src/users/entity/users.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EmailModule } from 'src/email/email.module';
import { TokenModule } from 'src/token/token.module';
import { SavingInstitution } from 'src/saving-institutions/entities/saving-institution.entity';
import { ServiceProvider } from 'src/service-provider/entities/service-provider.entity';
import { UserCooperative } from 'src/users/entity/user-cooperative.entity';
import { SubSavingProduct } from 'src/saving-products/entities/sub-saving-product.entity';
import { SavingProduct } from 'src/saving-products/entities/saving-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Saving,
      SavingInstitution,
      ServiceProvider,
      UserCooperative,
      SavingProduct,
      SubSavingProduct,
      User,
    ]),
    CloudinaryModule,
    EmailModule,
    TokenModule,
  ],
  controllers: [SavingController],
  exports: [SavingService],
  providers: [SavingService],
})
export class SavingModule {}
