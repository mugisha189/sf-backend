import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, Req, Put } from '@nestjs/common';
import { ProductPurchasesService } from './product-purchases.service';
import { CreateProductPurchaseDto } from './dto/create-product-purchase.dto';
import { UpdateProductPurchaseDto } from './dto/update-product-purchase.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constants/role.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';

@Controller('product-purchases')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class ProductPurchasesController {
  constructor(private readonly productPurchasesService: ProductPurchasesService) { }

  @Post()
  @ApiOperation({ summary: "Create product-purchase record" })
  @ApiResponse({
    status: 201,
    description: "created successfully"
  })
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUBSCRIBER, UserRole.SUPER_ADMIN)
  async create(@Body() createProductPurchaseDto: CreateProductPurchaseDto) {
    const result = await this.productPurchasesService.create(createProductPurchaseDto);
    return new CustomApiResponse("Created product purchase", result)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all product-purchase records" })
  @ApiResponse({
    status: 200,
    description: "retrieved successfully"
  })
  @Roles( UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  async findAll(@Req() req: any) {
    const result = await this.productPurchasesService.findAll(req);
    return new CustomApiResponse("Retrieved all purchases", result)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get product-purchase record" })
  @ApiResponse({
    status: 200,
    description: "retrieved successfully"
  })
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const result = await  this.productPurchasesService.findOne(id, req);
    return new CustomApiResponse("Retrieved the purchase successfully", result)
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Update product-purchase record" })
  @ApiResponse({
    status: 200,
    description: "updated successfully"
  })
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  async update(@Param('id') id: string, @Body() updateProductPurchaseDto: UpdateProductPurchaseDto, @Req() req: any) {
    const result = await this.productPurchasesService.update(id, updateProductPurchaseDto,req);
    return new CustomApiResponse("Updated the purchase successfully", result)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Delete product-purchase record" })
  @ApiResponse({
    status: 200,
    description: "deleted successfully"
  })
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  async remove(@Param('id') id: string, @Req() req:any) {
    const result = await this.productPurchasesService.remove(id, req);
    return new CustomApiResponse("Deleted the purchase successfully", result)
  }

  @Delete()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Delete all product-purchase records" })
  @ApiResponse({
    status: 200,
    description: "deleted successfully"
  })
  @Roles(UserRole.SUPER_ADMIN)
  async removeAll() {
    const result = await this.productPurchasesService.removeAll();
    return new CustomApiResponse("Deleted all purchases successfully", result)
  }
  

}
