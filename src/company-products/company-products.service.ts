import { Injectable } from '@nestjs/common';
import { CreateCompanyProductDto } from './dto/create-company-product.dto';
import { UpdateCompanyProductDto } from './dto/update-company-product.dto';

@Injectable()
export class CompanyProductsService {
  create(createCompanyProductDto: CreateCompanyProductDto) {
    return 'This action adds a new companyProduct';
  }

  findAll() {
    return `This action returns all companyProducts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyProduct`;
  }

  update(id: number, updateCompanyProductDto: UpdateCompanyProductDto) {
    return `This action updates a #${id} companyProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyProduct`;
  }
}
