import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyProductDto } from './dto/create-company-product.dto';
import { UpdateCompanyProductDto } from './dto/update-company-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyProduct } from './entities/company-product.entity';
import { Repository } from 'typeorm';
import { NODATA } from 'dns';

@Injectable()
export class CompanyProductsService {

  constructor(@InjectRepository(CompanyProduct) private companyProductRepo: Repository<CompanyProduct>) { }

  async create(createCompanyProductDto: CreateCompanyProductDto) {
    try {
      // console.log('request ', req);
      const companyProduct = new CompanyProduct(createCompanyProductDto)

      return this.companyProductRepo.save(companyProduct);
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<CompanyProduct[]> {
    try {
      const products = await this.companyProductRepo.find()
      return products
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string): Promise<CompanyProduct> {
    const product = await this.companyProductRepo.findOneBy({ id })
    if (!product) throw new NotFoundException("Company product not found");

    return product;
  }

  async update( id: string, updateCompanyProductDto: UpdateCompanyProductDto) {
    try {
      // console.log('Req ', req);
      const isUpdated = await this.companyProductRepo.update(id, updateCompanyProductDto)
      if (isUpdated.affected === 0) throw new NotFoundException("Company product not found")
        
        const updated = await this.companyProductRepo.findOneBy({ id })
        if (!updated) throw new NotFoundException("Company product not found")
          return updated;
        
      } catch (error) {
        throw error 
      }
  }

  async remove(id: string):Promise<Boolean> {
    try {
      const isDeleted = await this.companyProductRepo.delete({id})
      return isDeleted.affected !==0
    } catch (error) {
      throw error 
    }
  }

  async removeAll():Promise<Boolean> {
    try {
      const areDeleted = await this.companyProductRepo.delete({})
      return areDeleted.affected !==0
    } catch (error) {
      throw error 
    }
  }
}
