import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { CompanyProductsService } from './company-products.service';
import { CreateCompanyProductDto } from './dto/create-company-product.dto';
import { UpdateCompanyProductDto } from './dto/update-company-product.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';

@Controller('company-products')
export class CompanyProductsController {
  constructor(private readonly companyProductsService: CompanyProductsService) {}

  @ApiOperation({ summary: "Create a company product" })
  @ApiResponse({
    status: 201,
    description: "created successfully"
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCompanyProduct(@Body() createCompanyProductDto: CreateCompanyProductDto) {
    const result = await this.companyProductsService.create(createCompanyProductDto);
    return new CustomApiResponse("Created  company product successfully", result)
  }

  @ApiOperation({ summary: "Get all company products" })
  @ApiResponse({
    status: 201,
    description: "retrieved all successfully"
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllCompanyProducts() {
    const result = await this.companyProductsService.findAll();
    return new CustomApiResponse("Fetched all company products successfully", result)
  }

  @ApiOperation({ summary: "Get single company product" })
  @ApiResponse({
    status: 201,
    description: "retrieved successfully"
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const result = await this.companyProductsService.findOne(id);
    return new CustomApiResponse("Fetched company product successfully", result)
  }

  @ApiOperation({ summary: "Update company product" })
  @ApiResponse({
    status: 201,
    description: "updated successfully"
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateCompanyProductDto: UpdateCompanyProductDto) {
    const result = await this.companyProductsService.update(id, updateCompanyProductDto);
    return new CustomApiResponse("Updated company product successfully", result)
  }

  @ApiOperation({ summary: "Delete single company product" })
  @ApiResponse({
    status: 201,
    description: "deleted successfully"
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removePartnerComp(@Param('id') id: string) {
    const result = await this.companyProductsService.remove(id);
    return new CustomApiResponse("Delete company product successfully", result)
  }

  @ApiOperation({ summary: "Delete all company products" })
  @ApiResponse({
    status: 201,
    description: "deleted successfully"
  })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeAllParternComps(id: string) {
    const result = await this.companyProductsService.removeAll();
    return new CustomApiResponse("Delete all company product successfully", result)
  }
}
