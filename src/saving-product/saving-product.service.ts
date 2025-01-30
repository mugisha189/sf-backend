import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavingProductDto } from './dto/create-saving-product.dto';
import { UpdateSavingProductDto } from './dto/update-saving-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SavingProduct } from './entities/saving-product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SavingProductService {
  constructor(
    @InjectRepository(SavingProduct) private savingProductRepo: Repository<SavingProduct>,
  ) { }
  async create(createSavingProductDto: CreateSavingProductDto): Promise<SavingProduct> {
    try {
      const savingProduct = new SavingProduct({
        savingProductName: createSavingProductDto.savingProductName,
        companyName: createSavingProductDto.companyName,
        productDescription: createSavingProductDto.productDescription,
        cashBackChargeType: createSavingProductDto.cashBackChargeType,
        cashBackChargeValue: createSavingProductDto.cashBackChargeValue,
        cashBackMaximumCash: createSavingProductDto.cashBackMaximumCash,
        cashBackMinimumCash: createSavingProductDto.cashBackMinimumCash,
        entryPointName: createSavingProductDto.entryPointName,
        entryPointChargeType: createSavingProductDto.entryPointChargeType,
        entryPointChargeValue: createSavingProductDto.entryPointChargeValue
      })

      return await this.savingProductRepo.save(savingProduct)

    } catch (error) {
      throw error
    }

  }

  async findAll(): Promise<SavingProduct[]> {
    try {
      const savingProducts = await this.savingProductRepo.find()
      return savingProducts;
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string) {
    try {
      const savingProduct = await this.savingProductRepo.findOneBy({ id })
      if (!savingProduct) throw new NotFoundException("Saving product not found")
      return savingProduct;

    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateSavingProductDto: UpdateSavingProductDto) {
    try {
      const toBeUpdated = await this.savingProductRepo.update(id, updateSavingProductDto)
      if (toBeUpdated.affected === 0) {
        throw new NotFoundException("Saving product not found")
      }

      return this.savingProductRepo.findOneBy({ id });
    } catch (error) {
      throw error
    }
  }

  async remove(id: string):Promise<Boolean> {
    try {
      const result = await this.savingProductRepo.delete({id})
      
      return result.affected !== 0;

    } catch (error) {
      throw error
    }
  }

  async removeAll():Promise<Boolean> {
    try {
      const result = await this.savingProductRepo.delete({})
      
      return result.affected !== 0;
    } catch (error) {
      throw error
    }
  }
}
