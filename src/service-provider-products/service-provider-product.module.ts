import { Module } from '@nestjs/common';
import { ServiceProviderProductService } from './service-provider-product.service';
import { ServiceProviderProductController } from './service-provider-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProviderProduct } from './entities/service-provider-product.entity';
import { User } from 'src/users/entity/users.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EmailModule } from 'src/email/email.module';
import { TokenModule } from 'src/token/token.module';
import { ServiceProvider } from 'src/service-provider/entities/service-provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceProviderProduct, ServiceProvider, User]),
    CloudinaryModule,
    EmailModule,
    TokenModule,
  ],
  controllers: [ServiceProviderProductController],
  providers: [ServiceProviderProductService],
})
export class ServiceProviderProductModule {}
