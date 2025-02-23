import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseGuards, Put, Req } from '@nestjs/common';
import { CompanyProductsService } from './company-products.service';
import { CreateCompanyProductDto } from './dto/create-company-product.dto';
import { UpdateCompanyProductDto } from './dto/update-company-product.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomApiResponse } from 'src/apiResponse/ApiResponse';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constants/role.enum';

@Controller('company-products')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class CompanyProductsController {
  constructor(private readonly companyProductsService: CompanyProductsService) { }

  @ApiOperation({ summary: "Create a company product" })
  @ApiResponse({
    status: 201,
    description: "created successfully"
  })
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createCompanyProduct(@Body() createCompanyProductDto: CreateCompanyProductDto, @Req() req: any) {
    const result = await this.companyProductsService.create(createCompanyProductDto, req.user);
    return new CustomApiResponse("Created  company product successfully", result)
  }

  @ApiOperation({ summary: "Get all company products" })
  @ApiResponse({
    status: 200,
    description: "retrieved all successfully"
  })
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUBSCRIBER)
  @HttpCode(HttpStatus.OK)
  async findAllCompanyProducts() {
    const result = await this.companyProductsService.findAll();
    return new CustomApiResponse("Fetched all company products successfully", result)
  }


  @ApiOperation({ summary: "Get my company products" })
  @ApiResponse({
    status: 200,
    description: "retrieved all successfully"
  })
  @Get("/mine")
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUBSCRIBER)
  @HttpCode(HttpStatus.OK)
  async findMyCompanyProducts(@Req() req: any) {
    const result = await this.companyProductsService.findMine(req.user);
    return new CustomApiResponse("Fetched all company products successfully", result)
  }

  @ApiOperation({ summary: "Get single company product" })
  @ApiResponse({
    status: 200,
    description: "retrieved successfully"
  })
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SUBSCRIBER)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const result = await this.companyProductsService.findOne(id);
    return new CustomApiResponse("Fetched company product successfully", result)
  }

  @ApiOperation({ summary: "Update company product" })
  @ApiResponse({
    status: 200,
    description: "updated successfully"
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  async update(@Param('id') id: string, @Body() updateCompanyProductDto: UpdateCompanyProductDto) {
    const result = await this.companyProductsService.update(id, updateCompanyProductDto);
    return new CustomApiResponse("Updated company product successfully", result)
  }

  @ApiOperation({ summary: "Delete single company product" })
  @ApiResponse({
    status: 200,
    description: "deleted successfully"
  })
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  @HttpCode(HttpStatus.OK)
  async removePartnerComp(@Param('id') id: string) {
    console.log(id)
    const result = await this.companyProductsService.remove(id);
    return new CustomApiResponse("Delete company product successfully", result)
  }

  @ApiOperation({ summary: "Delete all company products" })
  @ApiResponse({
    status: 200,
    description: "deleted successfully"
  })
  @Delete()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  async removeAllParternComps(id: string) {
    const result = await this.companyProductsService.removeAll();
    return new CustomApiResponse("Delete all company product successfully", result)
  }
}

