import { PartialType } from '@nestjs/swagger';
import { CreateSavingProductDto } from './create-saving-product.dto';

export class UpdateSavingProductDto extends PartialType(CreateSavingProductDto) {}
