import { PartialType } from '@nestjs/swagger';
import { CreateServiceProviderDto } from './create-service-provider.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateServiceProviderDto extends CreateServiceProviderDto{
    
}
