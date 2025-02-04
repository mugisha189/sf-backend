import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Put } from '@nestjs/common';
import { SavingProductService } from './saving-product.service';
import { CreateSavingProductDto } from './dto/create-saving-product.dto';
import { UpdateSavingProductDto } from './dto/update-saving-product.dto';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constants/role.enum';

@Controller('saving-product')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class SavingProductController {
  constructor(private readonly savingProductService: SavingProductService) { }

  @ApiOperation({ summary: "Create a saving product" })
  @ApiResponse({
    status: 201,
    description: "created successfully"
  })
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSavingProduct(@Body() createSavingProductDto: CreateSavingProductDto) {
    const result = await this.savingProductService.create(createSavingProductDto)
    return new CustomApiResponse("Registered Saving Product successfully", result)
  }

  @ApiOperation({ summary: "Get all saving products" })
  @ApiResponse({
    status: 200,
    description: "retrieved successfully"
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN, UserRole.SUBSCRIBER)
  async findAllSavingProducts() {
    const result = await this.savingProductService.findAll();
    return new CustomApiResponse("All saving products here", result)
  }

  @ApiOperation({ summary: "Get single saving products" })
  @ApiResponse({
    status: 200,
    description: "retrieved successfully"
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.COMPANY_ADMIN, UserRole.SUPER_ADMIN, UserRole.SUBSCRIBER)
  async findSavingProduct(@Param('id') id: string) {
    const result = await this.savingProductService.findOne(id);
    return new CustomApiResponse("Saving product here", result)
  }

  @ApiOperation({ summary: "Update saving product" })
  @ApiResponse({
    status: 200,
    description: "update successfully"
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles( UserRole.SUPER_ADMIN)
  async updateSavingProduct(@Param('id') id: string, @Body() updateSavingProductDto: UpdateSavingProductDto) {
    const result = await this.savingProductService.update(id, updateSavingProductDto);
    return new CustomApiResponse("Updated saving product successfully", result)
  }

  @ApiOperation({ summary: "Delete single saving product" })
  @ApiResponse({
    status: 200,
    description: "deleted successfully"
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN)
  async removeSavingProduct(@Param('id') id: string) {
    const isDeleted = await this.savingProductService.remove(id);
    return new CustomApiResponse("Deleted saving product successfully", { isDeleted })
  }

  @ApiOperation({ summary: "Delete saving products" })
  @ApiResponse({
    status: 200,
    description: "deleted successfully"
  })
  @Delete()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN)
  async removeAllSavingProducts() {
    const areDeleted = await this.savingProductService.removeAll();
    return new CustomApiResponse("Deleted saving products successfully", { areDeleted })

  }
}
