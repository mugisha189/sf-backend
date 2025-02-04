import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyProductDto } from './dto/create-company-product.dto';
import { UpdateCompanyProductDto } from './dto/update-company-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyProduct } from './entities/company-product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyProductsService {

  constructor(@InjectRepository(CompanyProduct) private companyProductRepo: Repository<CompanyProduct>) { }

  async create(createCompanyProductDto: CreateCompanyProductDto): Promise<CompanyProduct> {
    try {
      // Create company product
      const companyProduct = new CompanyProduct(createCompanyProductDto)
      return this.companyProductRepo.save(companyProduct);

    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<CompanyProduct[]> {
    try {
      // Get all products
      const products = await this.companyProductRepo.find()
      return products
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string): Promise<CompanyProduct> {
    // Check if the product exists
    const product = await this.companyProductRepo.findOneBy({ id })
    if (!product) throw new NotFoundException("Company product not found");

    return product;
  }

  async update(id: string, updateCompanyProductDto: UpdateCompanyProductDto): Promise<CompanyProduct> {
    try {
      // Directly update the company product
      const isUpdated = await this.companyProductRepo.update(id, updateCompanyProductDto)
      if (isUpdated.affected === 0) throw new NotFoundException("Company product not found")

      // Check if the updated product is there
      const updated = await this.companyProductRepo.findOneBy({ id })
      if (!updated) throw new NotFoundException("Company product not found");
      return updated;

    } catch (error) {
      throw error
    }
  }

  async remove(id: string): Promise<Boolean> {
    try {
      // Check if user exists
      const user = await this.companyProductRepo.findOneBy({ id })
      if (!user) throw new NotFoundException("Company product not found")

      // Delete the product
      const isDeleted = await this.companyProductRepo.delete({ id })
      // Check true or false for deletion

      return isDeleted.affected !== 0
    } catch (error) {
      throw error
    }
  }

  async removeAll(): Promise<Boolean> {
    try {
      // deleted all products
      const areDeleted = await this.companyProductRepo.delete({})
      // Check true or false for deletion
      return areDeleted.affected !== 0
    } catch (error) {
      throw error
    }
  }
}
