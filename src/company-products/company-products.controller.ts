import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyProductsService } from './company-products.service';
import { CreateCompanyProductDto } from './dto/create-company-product.dto';
import { UpdateCompanyProductDto } from './dto/update-company-product.dto';

@Controller('company-products')
export class CompanyProductsController {
  constructor(private readonly companyProductsService: CompanyProductsService) {}

  @Post()
  create(@Body() createCompanyProductDto: CreateCompanyProductDto) {
    return this.companyProductsService.create(createCompanyProductDto);
  }

  @Get()
  findAll() {
    return this.companyProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyProductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyProductDto: UpdateCompanyProductDto) {
    return this.companyProductsService.update(+id, updateCompanyProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyProductsService.remove(+id);
  }
}
