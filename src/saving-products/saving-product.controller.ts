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
import { CreateSubSavingProductDto } from './dto/create-sub-saving-product.dto';
import { UpdateSubSavingProductDto } from './dto/update-sub-saving-product.dto';
import { SavingProductType } from './enums/saving-product-type.enum';

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
  @ApiQuery({
    name: 'status',
    enum: SavingProductStatus,
    required: false,
  })
  @ApiQuery({
    name: 'type',
    enum: SavingProductType,
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
    @Query('type') type?: SavingProductType,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.savingProductService.findAll(
      status,
      type,
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

  @Post(':id/subproducts')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add subproducts to a saving product' })
  @HttpCode(HttpStatus.CREATED)
  async addSubProducts(
    @Param('id') productId: string,
    @Body() dto: CreateSubSavingProductDto,
  ) {
    const result = await this.savingProductService.addSubProduct(
      productId,
      dto,
    );
    return new CustomApiResponse(
      'Subproduct added successfully to the saving product.',
      result,
    );
  }

  @Get(':id/subproducts')
  @ApiOperation({ summary: 'Get subproducts for a saving product' })
  async getSubProducts(@Param('id') productId: string) {
    const result = await this.savingProductService.getSubProducts(productId);
    return new CustomApiResponse(
      'Fetched subproducts for saving product successfully.',
      result,
    );
  }

  @Put('subproducts/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a subproduct' })
  async updateSubProduct(
    @Param('id') subProductId: string,
    @Body() dto: UpdateSubSavingProductDto,
  ) {
    const result = await this.savingProductService.updateSubProduct(
      subProductId,
      dto,
    );
    return new CustomApiResponse('Subproduct updated successfully.', result);
  }

  @Put('subproducts/:id/activate')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Activate a subproduct' })
  async activateSubProduct(@Param('id') subProductId: string) {
    await this.savingProductService.activateSubProduct(subProductId);
    return new CustomApiResponse('Subproduct activated successfully.', true);
  }

  @Put('subproducts/:id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Deactivate a subproduct' })
  async deactivateSubProduct(@Param('id') subProductId: string) {
    await this.savingProductService.deactivateSubProduct(subProductId);
    return new CustomApiResponse('Subproduct deactivated successfully.', true);
  }
}
