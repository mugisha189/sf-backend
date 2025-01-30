import { Injectable } from '@nestjs/common';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { UpdatePartnerCompanyDto } from './dto/update-partner-company.dto';

@Injectable()
export class PartnerCompanyService {
  create(createPartnerCompanyDto: CreatePartnerCompanyDto) {
    return 'This action adds a new partnerCompany';
  }

  findAll() {
    return `This action returns all partnerCompany`;
  }

  findOne(id: number) {
    return `This action returns a #${id} partnerCompany`;
  }

  update(id: number, updatePartnerCompanyDto: UpdatePartnerCompanyDto) {
    return `This action updates a #${id} partnerCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} partnerCompany`;
  }
}
