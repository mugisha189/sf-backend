import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { UpdatePartnerCompanyDto } from './dto/update-partner-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerCompany } from './entities/partner-company.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/constants/role.enum';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class PartnerCompanyService {
  constructor(@InjectRepository(PartnerCompany) private partnerCompanyRepo: Repository<PartnerCompany>,
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private configService: ConfigService
  ) { }
  async create(createPartnerCompanyDto: CreatePartnerCompanyDto): Promise<PartnerCompany> {
    try {
      const partnerCompany = new PartnerCompany(createPartnerCompanyDto)
      // Create company admin
      const companyAdmin = new CreateUserDto()
      companyAdmin.firstName = createPartnerCompanyDto.adminFirstName
      companyAdmin.lastName = createPartnerCompanyDto.adminLastName
      companyAdmin.phoneNumber = createPartnerCompanyDto.adminPhoneNumber
      companyAdmin.email = createPartnerCompanyDto.adminEmail
      companyAdmin.nationalId = this.configService.get('COMPANY_ADMIN_PASSWORD') || "defaultpassword"
      companyAdmin.role = UserRole.COMPANY_ADMIN
      const password = this.configService.get('COMPANY_ADMIN_NATIONAL_ID') || "defaultnationalid"
      companyAdmin.password = await bcrypt.hash(password, 10)

      const savedAdmin = await this.userRepo.save(companyAdmin);

      // Save the partner company
      partnerCompany.companyAdminId = savedAdmin.id
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

      const partnerToBeUpdated = await this.partnerCompanyRepo.findOneBy({ id });
      if (!partnerToBeUpdated) throw new NotFoundException("Partner company not found");


      const adminToBeUpdated = await this.userRepo.findOneBy({ id: updatePartnerCompanyDto.companyAdminId })
      if (!adminToBeUpdated) throw new NotFoundException("Company admin not found")

      // Update company Admin

      adminToBeUpdated.email = updatePartnerCompanyDto.adminEmail
      adminToBeUpdated.firstName = updatePartnerCompanyDto.adminFirstName
      adminToBeUpdated.lastName = updatePartnerCompanyDto.adminLastName
      adminToBeUpdated.phoneNumber = updatePartnerCompanyDto.adminPhoneNumber
      adminToBeUpdated.nationalId = this.configService.get('COMPANY_ADMIN_NATIONAL_ID') || "defaultnationalid"
      adminToBeUpdated.role = UserRole.COMPANY_ADMIN
      const password = this.configService.get('COMPANY_ADMIN_PASSWORD') || "defaultpassword"
      adminToBeUpdated.password = await bcrypt.hash(password, 10)
      await this.userRepo.save(adminToBeUpdated)

      partnerToBeUpdated.adminEmail = updatePartnerCompanyDto.adminEmail;
      partnerToBeUpdated.adminFirstName = updatePartnerCompanyDto.adminFirstName;
      partnerToBeUpdated.adminLastName = updatePartnerCompanyDto.adminLastName;
      partnerToBeUpdated.adminPhoneNumber = updatePartnerCompanyDto.adminPhoneNumber;
      partnerToBeUpdated.companyAdminId = updatePartnerCompanyDto.companyAdminId;
      partnerToBeUpdated.companyName = updatePartnerCompanyDto.companyName;
      partnerToBeUpdated.companyType = updatePartnerCompanyDto.companyType;


      return await this.partnerCompanyRepo.save(partnerToBeUpdated);

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
