import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
      // Create saving product
      const savingProduct = new SavingProduct(createSavingProductDto)
      return await this.savingProductRepo.save(savingProduct)

    } catch (error) {
      throw new BadRequestException(error.message)
    }

  }

  async findAll(): Promise<SavingProduct[]> {
    try {
      // Get all saving products
      const savingProducts = await this.savingProductRepo.find()
      return savingProducts;
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string): Promise<SavingProduct> {
    try {
      // Check if savingProduct exists
      const savingProduct = await this.savingProductRepo.findOneBy({ id })
      if (!savingProduct) throw new NotFoundException("Saving product not found")
      return savingProduct;

    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateSavingProductDto: UpdateSavingProductDto): Promise<SavingProduct> {
    try {
      // Directly update the savingProduct
      const toBeUpdated = await this.savingProductRepo.update(id, updateSavingProductDto)

      // Check if saving Product was updated 
      if (toBeUpdated.affected === 0) {
        throw new NotFoundException("Saving product not found")
      }

      // Return the updated savingProduct
      const updated = await this.savingProductRepo.findOneBy({ id });
      if (!updated) throw new NotFoundException("Saving product not found");

      return updated;
    } catch (error) {
      throw error
    }
  }

  async remove(id: string): Promise<Boolean> {
    try {
      // Check if the savingProduct exists
      const product = await this.savingProductRepo.findOneBy({ id })
      if (!product) throw new NotFoundException("Saving product not found")

      // Delete the product
      const result = await this.savingProductRepo.delete({ id })
      return result.affected !== 0;

    } catch (error) {
      throw error
    }
  }

  async removeAll(): Promise<Boolean> {
    try {
      // Deleted all saving products
      const result = await this.savingProductRepo.delete({})
      return result.affected !== 0;
    } catch (error) {
      throw error
    }
  }
}
