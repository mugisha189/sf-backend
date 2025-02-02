import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductPurchaseDto } from './dto/create-product-purchase.dto';
import { UpdateProductPurchaseDto } from './dto/update-product-purchase.dto';
import { ProductPurchase } from './entities/product-purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductPurchasesService {
  constructor(@InjectRepository(ProductPurchase) private productPurchaseRepo: Repository<ProductPurchase>){}
  async create(createProductPurchaseDto: CreateProductPurchaseDto):Promise<ProductPurchase> {
    try {
      const purchased = new ProductPurchase(createProductPurchaseDto)
      return await this.productPurchaseRepo.save(purchased)
    } catch (error) {
      throw error
    }
  }

  async findAll():Promise<ProductPurchase[]> {
    try {
      const purchases = await this.productPurchaseRepo.find()
      return purchases
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string) {
    try {
      const purchase = await this.productPurchaseRepo.findOneBy({id})
      if(!purchase) throw new NotFoundException("Product purchase not found")

      return purchase;
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateProductPurchaseDto: UpdateProductPurchaseDto): Promise<ProductPurchase> {
    try {
      
      const toBeUpdated = await this.productPurchaseRepo.findOneBy({id})
      if(!toBeUpdated) throw new NotFoundException("Product purchase not found")
        
        toBeUpdated.companyName = updateProductPurchaseDto.companyName
        toBeUpdated.companyType = updateProductPurchaseDto.companyType
        toBeUpdated.ejoHezaAmount = updateProductPurchaseDto.ejoHezaAmount
        toBeUpdated.product = updateProductPurchaseDto.product
        toBeUpdated.productAmount = updateProductPurchaseDto.productAmount
        toBeUpdated.savingProductName = updateProductPurchaseDto.savingProductName
        toBeUpdated.sfAmount = updateProductPurchaseDto.sfAmount
        toBeUpdated.trxAmount = updateProductPurchaseDto.trxAmount
        
        const updated = this.productPurchaseRepo.save(toBeUpdated)
        return updated;
      } catch (error) {
        throw error
      }
  }

  async remove(id: string):Promise<Boolean> {
    try {
      
      const isDeleted = await this.productPurchaseRepo.delete(id)
      return isDeleted.affected !==0;
    } catch (error) {
      throw error
    }
  }

  async removeAll(id: string):Promise<Boolean> {
    try {
      
      const isDeleted = await this.productPurchaseRepo.delete(id)
      return isDeleted.affected !==0;
    } catch (error) {
      throw error
    }
  }
}
