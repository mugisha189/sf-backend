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
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class PartnerCompanyService {
  constructor(
    @InjectRepository(PartnerCompany) private partnerCompanyRepo: Repository<PartnerCompany>,
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private configService: ConfigService,
    private datasource: DataSource,
    private cloudinaryService: CloudinaryService,
    private tokenService: TokenService,
    private emailService: EmailService,
    private jwtService: JwtService
  ) { }

  async create(createPartnerCompanyDto: CreatePartnerCompanyDto): Promise<PartnerCompany> {
    try {
      const partnerCompany = new PartnerCompany({
        companyName: createPartnerCompanyDto.companyName,
        companyType: createPartnerCompanyDto.companyType,
        partnershipType: createPartnerCompanyDto.partnershipType
      });
      const companyAdmin = new CreateUserDto();
      companyAdmin.firstName = createPartnerCompanyDto.adminFirstName;
      companyAdmin.lastName = createPartnerCompanyDto.adminLastName;
      companyAdmin.phoneNumber = createPartnerCompanyDto.adminPhoneNumber;
      companyAdmin.email = createPartnerCompanyDto.adminEmail;
      companyAdmin.nationalId = createPartnerCompanyDto.adminNationalId;
      companyAdmin.role = UserRole.COMPANY_ADMIN;
      companyAdmin.password = await bcrypt.hash("Default@123", 10);
      const savedAdmin = await this.userRepo.save(companyAdmin);
      partnerCompany.companyAdmin = savedAdmin;
      const savedCompany = await this.partnerCompanyRepo.save(partnerCompany);
      const token = await this.jwtService.signAsync({
        userId: savedAdmin.id, email: companyAdmin.email, role: "COMPANY_ADMIN"
      }, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: "10d",
      });
      await this.tokenService.createtoken({ token, userId: savedAdmin.id })
      await this.emailService.sendPartnerCompanyWelcomeEmail(savedAdmin.email, savedCompany.companyName);
      const setupLink = `${this.configService.get("FRONTEND_BASE_URL")}/set-password?token=${token}`;
      await this.emailService.sendPartnerCompanySetupEmail(savedAdmin.email, savedCompany.companyName, setupLink);

      return savedCompany;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<PartnerCompany[]> {
    try {
      return await this.partnerCompanyRepo.find({ relations: ['companyAdmin'], });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<PartnerCompany> {
    try {
      const partnerCompany = await this.partnerCompanyRepo.findOne({
        where: { id },
        relations: ['companyAdmin'],
      });
      if (!partnerCompany) throw new NotFoundException('Partner company not found');
      return partnerCompany;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePartnerCompanyDto: UpdatePartnerCompanyDto) {
    try {
      const partnerToBeUpdated = await this.partnerCompanyRepo.findOneBy({ id });
      if (!partnerToBeUpdated) throw new NotFoundException('Partner company not found');

      const adminToBeUpdated = await this.userRepo.findOneBy({ id: partnerToBeUpdated.companyAdmin.id });
      if (!adminToBeUpdated) throw new NotFoundException('Company admin not found');

      adminToBeUpdated.email = updatePartnerCompanyDto.adminEmail;
      adminToBeUpdated.firstName = updatePartnerCompanyDto.adminFirstName;
      adminToBeUpdated.lastName = updatePartnerCompanyDto.adminLastName;
      adminToBeUpdated.phoneNumber = updatePartnerCompanyDto.adminPhoneNumber;
      adminToBeUpdated.nationalId = updatePartnerCompanyDto.adminNationalId;
      adminToBeUpdated.role = UserRole.COMPANY_ADMIN;
      adminToBeUpdated.password = await bcrypt.hash("Default@123", 10);

      await this.userRepo.save(adminToBeUpdated);

      partnerToBeUpdated.companyAdmin = adminToBeUpdated;
      partnerToBeUpdated.companyName = updatePartnerCompanyDto.companyName;
      partnerToBeUpdated.companyType = updatePartnerCompanyDto.companyType;

      return await this.partnerCompanyRepo.save(partnerToBeUpdated);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.datasource.transaction(async (manager) => {
        const toBeDeleted = await manager.findOne(PartnerCompany, { where: { id } });

        if (!toBeDeleted) throw new NotFoundException('Partner company not found');
        await manager.delete(Users, { id: toBeDeleted.companyAdmin.id });
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
      const usersWithAvatars = await this.datasource.transaction(async (manager) => {
        const users = await manager.createQueryBuilder(Users, 'user')
          .innerJoin(PartnerCompany, 'pc', 'pc."companyAdminId" = user.id')
          .where('user.avatarPublicId IS NOT NULL')
          .select('user.avatarPublicId')
          .getRawMany();

        await manager.createQueryBuilder()
          .delete()
          .from(Users)
          .where(`id IN (SELECT "companyAdminId" FROM partner_company)`)
          .execute();

        await manager.delete(PartnerCompany, {});

        return users;
      });

      const cloudinaryDeletionPromises = usersWithAvatars
        .map(user => this.cloudinaryService.deleteFile(user.avatarPublicId));

      const results = await Promise.allSettled(cloudinaryDeletionPromises);

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
      return this.cloudinaryService.getImagesInFolder();
    } catch (error) {
      throw error;
    }
  }

  private async retryCloudinaryDeletions(users: { avatarPublicId: string }[], retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const retryPromises = users.map(user => this.cloudinaryService.deleteFile(user.avatarPublicId));
      const results = await Promise.allSettled(retryPromises);

      users = results
        .map((result, index) => (result.status === 'rejected' ? users[index] : null))
        .filter((user): user is { avatarPublicId: string } => user !== null);

      if (users.length === 0) return;

      console.warn(`Retry attempt ${attempt} failed for ${users.length} images. Retrying...`);
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
    }

    console.error(`Failed to delete ${users.length} Cloudinary images after multiple retries:`, users);
  }
}
