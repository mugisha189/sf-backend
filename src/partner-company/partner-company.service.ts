import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { UpdatePartnerCompanyDto } from './dto/update-partner-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerCompany } from './entities/partner-company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerCompanyService {
  constructor(@InjectRepository(PartnerCompany) private partnerCompanyRepo: Repository<PartnerCompany>) { }
  async create(createPartnerCompanyDto: CreatePartnerCompanyDto): Promise<PartnerCompany> {
    try {
      const partnerCompany = new PartnerCompany(createPartnerCompanyDto)
      return await this.partnerCompanyRepo.save(partnerCompany);

    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<PartnerCompany[]> {
    try {
      return await this.partnerCompanyRepo.find();

    } catch (error) {
      throw error
    }
  }

  async findOne(id: string): Promise<PartnerCompany> {
    try {
      const partnerCompany = await this.partnerCompanyRepo.findOneBy({ id })
      if (!partnerCompany) throw new NotFoundException("Partner company not found");

      return partnerCompany;

    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePartnerCompanyDto: UpdatePartnerCompanyDto) {
    try {
      const toBeUpdated = await this.partnerCompanyRepo.update(id, updatePartnerCompanyDto)
      if (toBeUpdated.affected === 0) {
        throw new NotFoundException("Partner company not found")
      }

      const updated = await this.partnerCompanyRepo.findOneBy({ id });
      if (!updated) throw new NotFoundException("Partner company not found");

      return updated;

    } catch (error) {
      throw error
    }
  }

  async remove(id: string): Promise<Boolean> {
    try {
      const result = await this.partnerCompanyRepo.delete({ id })

      return result.affected !== 0;

    } catch (error) {
      throw error
    }
  }

  async removeAll(): Promise<Boolean> {
    try {
      const result = await this.partnerCompanyRepo.delete({})
      
      return result.affected !== 0;
    } catch (error) {
      throw error
    }
  }
}
