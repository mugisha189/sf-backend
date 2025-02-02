import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductPurchasesService } from './product-purchases.service';
import { CreateProductPurchaseDto } from './dto/create-product-purchase.dto';
import { UpdateProductPurchaseDto } from './dto/update-product-purchase.dto';

@Controller('product-purchases')
export class ProductPurchasesController {
  constructor(private readonly productPurchasesService: ProductPurchasesService) {}

  @Post()
  create(@Body() createProductPurchaseDto: CreateProductPurchaseDto) {
    return this.productPurchasesService.create(createProductPurchaseDto);
  }

  @Get()
  findAll() {
    return this.productPurchasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productPurchasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductPurchaseDto: UpdateProductPurchaseDto) {
    return this.productPurchasesService.update(+id, updateProductPurchaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPurchasesService.remove(+id);
  }
}
