import { PartialType } from '@nestjs/swagger';
import { CreateCooperativeSavingsDto } from './create-cooperative-saving.dto';

export class UpdateCooperativeSavingDto extends PartialType(
  CreateCooperativeSavingsDto,
) {}
