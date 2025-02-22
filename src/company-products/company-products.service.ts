import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyProductDto } from './dto/create-company-product.dto';
import { UpdateCompanyProductDto } from './dto/update-company-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyProduct } from './entities/company-product.entity';
import { Repository } from 'typeorm';
import { PartnerCompany } from 'src/partner-company/entities/partner-company.entity';

@Injectable()
export class CompanyProductsService {

  constructor(@InjectRepository(CompanyProduct) private companyProductRepo: Repository<CompanyProduct>, @InjectRepository(PartnerCompany) private partnerCompanyRepo: Repository<PartnerCompany>,) { }

  async create(createCompanyProductDto: CreateCompanyProductDto): Promise<CompanyProduct> {
    try {
      const company = await this.partnerCompanyRepo.findOneBy({ id: createCompanyProductDto.companyId });
      if (!company) {
        throw new NotFoundException("Partner company not found");
      }

      const companyProduct = new CompanyProduct({
        ...createCompanyProductDto,
        company,
      });

      return await this.companyProductRepo.save(companyProduct);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateCompanyProductDto: UpdateCompanyProductDto): Promise<CompanyProduct> {
    try {
      const existingProduct = await this.companyProductRepo.findOne({
        where: { id },
        relations: ["company"],
      });

      if (!existingProduct) {
        throw new NotFoundException("Company product not found");
      }

      if (updateCompanyProductDto.companyId) {
        const company = await this.partnerCompanyRepo.findOneBy({ id: updateCompanyProductDto.companyId });
        if (!company) {
          throw new NotFoundException("Partner company not found");
        }
        existingProduct.company = company;
      }
      Object.assign(existingProduct, updateCompanyProductDto);
      return await this.companyProductRepo.save(existingProduct);
    } catch (error) {
      throw error;
    }
  }


  async findAll(): Promise<CompanyProduct[]> {
    try {
      // Get all products
      const products = await this.companyProductRepo.find({ relations: ['company'], })
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
