import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { UpdatePartnerCompanyDto } from './dto/update-partner-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerCompany } from './entities/partner-company.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/constants/role.enum';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/entity/users.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PartnerCompanyService {
  constructor(@InjectRepository(PartnerCompany) private partnerCompanyRepo: Repository<PartnerCompany>,
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private configService: ConfigService,
    private datasource: DataSource,
    private cloudinaryService: CloudinaryService
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

      const avatarUrl = this.configService.get('COMPANY_ADMIN_AVATAR_URL') || ""
      const avatarPublicId = this.configService.get('COMPANY_ADMIN_AVATAR_URL') || ""

      const savedAdmin = await this.userRepo.save({
        ...companyAdmin,
        avatarUrl,
        avatarPublicId

      });

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

      const newPublicId = this.configService.get('COMPANY_ADMIN_AVATAR_PUBLIC_ID')
      const newUrl = this.configService.get('COMPANY_ADMIN_AVATAR_URL')
      if (!newPublicId && !newUrl) throw new BadRequestException("No adminAvatar publicId/url provided")

      if (adminToBeUpdated.avatarPublicId !== newPublicId) {
        const result = await this.cloudinaryService.deleteFile(adminToBeUpdated.avatarPublicId)
        if (!result) throw new BadRequestException("Image deletion failed");

        adminToBeUpdated.avatarPublicId = newPublicId
        adminToBeUpdated.avatarUrl = newUrl
      }

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

  // async remove(id: string): Promise<Boolean> {
  //   try {
  //     await this.datasource.transaction(async (manager) => {
  //       const toBeDeleted = await manager.findOne(PartnerCompany, { where: { id } });
  //       if (!toBeDeleted) throw new NotFoundException('Partner company not found');

  //       await manager.delete(Users, { id: toBeDeleted.companyAdminId });
  //       await manager.delete(PartnerCompany, { id });
  //     });

  //     const toBeDeleted = await this.partnerCompanyRepo.findOneBy({id})
  //     if(!toBeDeleted)  throw new NotFoundException("Partner company not found");

  //     await this.userRepo.delete({id: toBeDeleted.companyAdminId});
  //     const result = await this.partnerCompanyRepo.delete({ id })

  //     return result.affected !== 0;

  //   } catch (error) {
  //     throw error
  //   }
  // }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.datasource.transaction(async (manager) => {
        // Find the partner company by ID
        const toBeDeleted = await manager.findOne(PartnerCompany, { where: { id } });

        if (!toBeDeleted) {
          throw new NotFoundException('Partner company not found');
        }

        // Find the user to get avatar public ID before deletion 
        const user = await manager.findOne(Users, {
          where:{id: toBeDeleted.companyAdminId},
          select: ['avatarPublicId']

        })

        if(!user) throw new NotFoundException("Company admin not found")
        
        // Delete the cloudinary image
        if(user.avatarPublicId){
          await this.cloudinaryService.deleteFile(user.avatarPublicId)
        }

        // Delete the associated user
        await manager.delete(Users, { id: toBeDeleted.companyAdminId });

        // Delete the partner company
        return await manager.delete(PartnerCompany, { id });
      });

      return result.affected !== 0;

    } catch (error) {
      console.error('Error during deletion:', error);
      throw error;
    }
  }


  // async removeAll(): Promise<Boolean> {
  //   try {
  //     const result = await this.partnerCompanyRepo.delete({})

  //     return result.affected !== 0;
  //   } catch (error) {
  //     throw error
  //   }
  // }

  async removeAll(): Promise<boolean> {
    try {
      const result = await this.datasource.transaction(async (manager) => {
        // Find all users with avatarPublicId associated with partner companies
        const usersWithAvatars = await manager.createQueryBuilder(Users, 'user')
          .innerJoin(PartnerCompany, 'pc', 'pc."companyAdminId" = user.id')
          .where('user.avatarPublicId IS NOT NULL')
          .select('user.avatarPublicId')
          .getRawMany();
    
        // Delete Cloudinary images
        const cloudinaryDeletionPromises = usersWithAvatars
          .map(user => this.cloudinaryService.deleteFile(user.avatarPublicId));
        
        await Promise.all(cloudinaryDeletionPromises);
    
        // Delete all users associated with partner companies
        await manager.createQueryBuilder()
          .delete()
          .from(Users)
          .where(`id IN (SELECT "companyAdminId" FROM partner_company)`)
          .execute();
    
        // Delete all partner companies
        return await manager.delete(PartnerCompany, {});
      });
    
      return result.affected !== 0;
    } catch (error) {
      console.error('Error during bulk deletion:', error);
      throw error;
    }
  }

  async getImages() {
    try {
      return this.cloudinaryService.getImagesInFolder()
    } catch (error) {
      throw error
    }
  }
}
