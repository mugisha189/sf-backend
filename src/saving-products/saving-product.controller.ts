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
import { SavingProductService } from './saving-product.service';
import { CreateSavingProductDto } from './dto/create-saving-product.dto';
import { UpdateSavingProductDto } from './dto/update-saving-product.dto';
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
import { SavingProductStatus } from './enums/saving-product-status.enum';

@Controller('saving-product')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('Saving Product')
export class SavingProductController {
  constructor(private readonly savingProductService: SavingProductService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create service provider product' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSavingProductDto) {
    const result = await this.savingProductService.create(dto);
    return new CustomApiResponse(
      'Service provider product created successfully.',
      result,
    );
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiQuery({
    name: 'status',
    enum: SavingProductStatus,
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
    @Query('status') status?: SavingProductStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.savingProductService.findAll(
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
    const result = await this.savingProductService.findOne(id);
    return new CustomApiResponse(
      'Fetched service provider product successfully.',
      result,
    );
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateSavingProductDto) {
    const result = await this.savingProductService.update(id, dto);
    return new CustomApiResponse(
      'Service provider product updated successfully.',
      result,
    );
  }

  @Put(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  async deactivate(@Param('id') id: string) {
    await this.savingProductService.deactivate(id);
    return new CustomApiResponse('Service provider product deactivated.', true);
  }

  @Put(':id/activate')
  @Roles(UserRole.SUPER_ADMIN)
  async activate(@Param('id') id: string) {
    await this.savingProductService.activate(id);
    return new CustomApiResponse('Service provider product activated.', true);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    const result = await this.savingProductService.remove(id);
    return new CustomApiResponse(
      'Service provider product deleted successfully.',
      result,
    );
  }
}
