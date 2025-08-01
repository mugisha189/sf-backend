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
  UseGuards,
} from '@nestjs/common';
import { ServiceProviderProductService } from './service-provider-product.service';
import { CreateServiceProviderProductDto } from './dto/create-service-provider-product.dto';
import { UpdateServiceProviderProductDto } from './dto/update-service-provider-product.dto';
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
import { UserRole } from 'src/constants/role.enum';
import { ServiceProviderProductStatus } from './enums/service-provider-product-status.enum';

@Controller('service-provider-product')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Service Provider Product')
export class ServiceProviderProductController {
  constructor(private readonly service: ServiceProviderProductService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create service provider product' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateServiceProviderProductDto) {
    const result = await this.service.create(dto);
    return new CustomApiResponse(
      'Service provider product created successfully.',
      result,
    );
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiQuery({
    name: 'status',
    enum: ServiceProviderProductStatus,
    required: false,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'mobile',
  })
  async findAll(
    @Query('status') status?: ServiceProviderProductStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.service.findAll(
      status,
      Number(page),
      Number(limit),
      search,
    );
    return new CustomApiResponse(
      'Fetched service provider products successfully.',
      result,
    );
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    const result = await this.service.findOne(id);
    return new CustomApiResponse(
      'Fetched service provider product successfully.',
      result,
    );
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceProviderProductDto,
  ) {
    const result = await this.service.update(id, dto);
    return new CustomApiResponse(
      'Service provider product updated successfully.',
      result,
    );
  }

  @Put(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  async deactivate(@Param('id') id: string) {
    await this.service.deactivate(id);
    return new CustomApiResponse('Service provider product deactivated.', true);
  }

  @Put(':id/activate')
  @Roles(UserRole.SUPER_ADMIN)
  async activate(@Param('id') id: string) {
    await this.service.activate(id);
    return new CustomApiResponse('Service provider product activated.', true);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    const result = await this.service.remove(id);
    return new CustomApiResponse(
      'Service provider product deleted successfully.',
      result,
    );
  }
}
