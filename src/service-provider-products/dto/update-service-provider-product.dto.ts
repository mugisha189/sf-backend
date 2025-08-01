import { PartialType } from '@nestjs/swagger';
import { CreateServiceProviderProductDto } from './create-service-provider-product.dto';

export class UpdateServiceProviderProductDto extends PartialType(
  CreateServiceProviderProductDto,
) {}
