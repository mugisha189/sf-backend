import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { SavingInstitutionService } from './saving-institution.service';
import { CreateSavingInstitutionDto } from './dto/create-saving-institution.dto';
import { UpdateSavingInstitutionDto } from './dto/update-saving-institution.dto';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { UserRole } from 'src/constants/role.enum';
import { SavingInstitutionStatus } from './enums/saving-institution-status.enum';

@Controller('saving-institution')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Saving Institution')
export class SavingInstitutionController {
  constructor(
    private readonly serviceProviderService: SavingInstitutionService,
  ) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create service provider' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSavingInstitutionDto) {
    const result = await this.serviceProviderService.create(dto);
    return new CustomApiResponse(
      'Service provider created successfully.',
      result,
    );
  }
  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiQuery({ name: 'status', enum: SavingInstitutionStatus, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'telecom',
  })
  async findAll(
    @Query('status') status?: SavingInstitutionStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.serviceProviderService.findAll(
      status,
      Number(page),
      Number(limit),
      search,
    );
    return new CustomApiResponse(
      'Fetched service providers successfully.',
      result,
    );
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    const result = await this.serviceProviderService.findOne(id);
    return new CustomApiResponse(
      'Fetched service provider successfully.',
      result,
    );
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSavingInstitutionDto,
  ) {
    const result = await this.serviceProviderService.update(id, dto);
    return new CustomApiResponse(
      'Service provider updated successfully.',
      result,
    );
  }

  @Put(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  async deactivate(@Param('id') id: string) {
    await this.serviceProviderService.deactivate(id);
    return new CustomApiResponse('Service provider deactivated.', true);
  }

  @Put(':id/activate')
  @Roles(UserRole.SUPER_ADMIN)
  async activate(@Param('id') id: string) {
    await this.serviceProviderService.activate(id);
    return new CustomApiResponse('Service provider activated.', true);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    const result = await this.serviceProviderService.remove(id);
    return new CustomApiResponse(
      'Service provider deleted successfully.',
      result,
    );
  }
}
