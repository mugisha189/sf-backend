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
      // create partner company
      const partnerCompany = new PartnerCompany(createPartnerCompanyDto)

      // create company admin
      const companyAdmin = new CreateUserDto()
      companyAdmin.firstName = createPartnerCompanyDto.adminFirstName
      companyAdmin.lastName = createPartnerCompanyDto.adminLastName
      companyAdmin.phoneNumber = createPartnerCompanyDto.adminPhoneNumber
      companyAdmin.email = createPartnerCompanyDto.adminEmail
      companyAdmin.nationalId = this.configService.get('COMPANY_ADMIN_PASSWORD') || "defaultpassword"
      companyAdmin.role = UserRole.COMPANY_ADMIN
      const password = this.configService.get('COMPANY_ADMIN_NATIONAL_ID') || "defaultnationalid"
      companyAdmin.password = await bcrypt.hash(password, 10)

      // Get avatarurl and publicid from .env
      const avatarUrl = this.configService.get('COMPANY_ADMIN_AVATAR_URL') || ""
      const avatarPublicId = this.configService.get('COMPANY_ADMIN_AVATAR_PUBLIC_ID') || ""

      // Now save company admin
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
      // Check if partner company exists
      const partnerCompany = await this.partnerCompanyRepo.findOneBy({ id })
      if (!partnerCompany) throw new NotFoundException("Partner company not found");

      // Return the company
      return partnerCompany;

    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePartnerCompanyDto: UpdatePartnerCompanyDto) {
    try {
      // Check if company already exists
      const partnerToBeUpdated = await this.partnerCompanyRepo.findOneBy({ id });
      if (!partnerToBeUpdated) throw new NotFoundException("Partner company not found");

      // Check if company admin already exists
      const adminToBeUpdated = await this.userRepo.findOneBy({ id: partnerToBeUpdated.companyAdminId })
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

      // Check if avatar_information
      const newPublicId = this.configService.get('COMPANY_ADMIN_AVATAR_PUBLIC_ID')
      const newUrl = this.configService.get('COMPANY_ADMIN_AVATAR_URL')

      // If not throw error
      if (!newPublicId && !newUrl) throw new BadRequestException("No adminAvatar publicId/url provided")

      // Check if avatar information changed
      if (adminToBeUpdated.avatarPublicId !== newPublicId) {
        //Delete old user_avatar
        const result = await this.cloudinaryService.deleteFile(adminToBeUpdated.avatarPublicId)
        if (!result) throw new BadRequestException("Image deletion failed");

        // Save new user_avatar
        adminToBeUpdated.avatarPublicId = newPublicId
        adminToBeUpdated.avatarUrl = newUrl
      }

      // Save updated company_admin information
      await this.userRepo.save(adminToBeUpdated)

      // Update the company info
      partnerToBeUpdated.adminEmail = updatePartnerCompanyDto.adminEmail;
      partnerToBeUpdated.adminFirstName = updatePartnerCompanyDto.adminFirstName;
      partnerToBeUpdated.adminLastName = updatePartnerCompanyDto.adminLastName;
      partnerToBeUpdated.adminPhoneNumber = updatePartnerCompanyDto.adminPhoneNumber;
      partnerToBeUpdated.companyAdminId = adminToBeUpdated.id;
      partnerToBeUpdated.companyName = updatePartnerCompanyDto.companyName;
      partnerToBeUpdated.companyType = updatePartnerCompanyDto.companyType;

      // Save updated company information
      return await this.partnerCompanyRepo.save(partnerToBeUpdated);

    } catch (error) {
      throw error
    }
  }



  async remove(id: string): Promise<boolean> {
    try {
      // Create a database_transaction for all ops to success or fail(atomicty)
      const result = await this.datasource.transaction(async (manager) => {
        // Find the partner company by ID
        const toBeDeleted = await manager.findOne(PartnerCompany, { where: { id } });

        if (!toBeDeleted) {
          throw new NotFoundException('Partner company not found');
        }

        // Find the user to get avatar public ID before deletion 
        const user = await manager.findOne(Users, {
          where: { id: toBeDeleted.companyAdminId },
          select: ['avatarPublicId']

        })

        // Check if the user to be deleted exists
        if (!user) throw new NotFoundException("Company admin not found")

        // Delete the cloudinary image
        if (user.avatarPublicId) {
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



  async removeAll(): Promise<boolean> {
    try {
      // Create a database_transaction for all ops to success or fail(atomicty)
      const usersWithAvatars = await this.datasource.transaction(async (manager) => {
        // Find all users with avatarPublicId associated with partner companies
        const users = await manager.createQueryBuilder(Users, 'user')
          .innerJoin(PartnerCompany, 'pc', 'pc."companyAdminId" = user.id')
          .where('user.avatarPublicId IS NOT NULL')
          .select('user.avatarPublicId')
          .getRawMany();


        // Delete all users associated with partner companies
        await manager.createQueryBuilder()
          .delete()
          .from(Users)
          .where(`id IN (SELECT "companyAdminId" FROM partner_company)`)
          .execute();

        // Delete all partner companies
        await manager.delete(PartnerCompany, {});

        return users
      });

      // Delete Cloudinary images after transaction succeeds
      const cloudinaryDeletionPromises = usersWithAvatars
        .map(user => this.cloudinaryService.deleteFile(user.avatarPublicId));

      // Wait for all deletions to complete, even if some fail
      const results = await Promise.allSettled(cloudinaryDeletionPromises);

      // Retry failed deletions
      const failedDeletions = results
        .map((result, index) => (result.status === 'rejected' ? usersWithAvatars[index] : null))
        .filter(Boolean);

      if (failedDeletions.length > 0) {
        console.warn('Retrying failed Cloudinary deletions...');
        await this.retryCloudinaryDeletions(failedDeletions);
      }

      return true;
    } catch (error) {
      console.error('Error during bulk deletion:', error);
      throw error;
    }
  }

  async getImages() {
    try {
      // Get secure_urls and publicIds
      return this.cloudinaryService.getImagesInFolder()
    } catch (error) {
      throw error
    }
  }

  // Retry Cloudinary deletions with exponential backoff
  private async retryCloudinaryDeletions(users: { avatarPublicId: string }[], retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const retryPromises = users.map(user => this.cloudinaryService.deleteFile(user.avatarPublicId));
      const results = await Promise.allSettled(retryPromises);
  
      // Filter out remaining failed deletions and assert type
      users = results
        .map((result, index) => (result.status === 'rejected' ? users[index] : null))
        .filter((user): user is { avatarPublicId: string } => user !== null); // Type assertion
  
      if (users.length === 0) return; // All deletions succeeded
  
      console.warn(`Retry attempt ${attempt} failed for ${users.length} images. Retrying...`);
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt))); // Exponential backoff
    }
  
    console.error(`Failed to delete ${users.length} Cloudinary images after multiple retries:`, users);
  }
  

}
