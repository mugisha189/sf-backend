import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateSavingInstitutionDto } from './dto/create-saving-institution.dto';
import { UpdateSavingInstitutionDto } from './dto/update-saving-institution.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SavingInstitution } from './entities/saving-institution.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entity/users.entity';
import { UserRole } from 'src/constants/role.enum';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { EmailService } from 'src/email/email.service';
import { SavingInstitutionStatus } from './enums/saving-institution-status.enum';

@Injectable()
export class SavingInstitutionService {
  constructor(
    @InjectRepository(SavingInstitution)
    private savingInstitutionRepo: Repository<SavingInstitution>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private datasource: DataSource,
    private configService: ConfigService,
    private tokenService: TokenService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  /** Create service provider with admin user */
  async create(
    createDto: CreateSavingInstitutionDto,
  ): Promise<SavingInstitution> {
    return this.datasource.transaction(async (manager) => {
      try {
        const existing = await this.userRepo.findOne({
          where: { email: createDto.admin.email },
        });
        if (existing)
          throw new BadRequestException('Email is already registered.');

        const admin = this.userRepo.create({
          firstName: createDto.admin.firstName,
          lastName: createDto.admin.lastName,
          phoneNumber: createDto.admin.phoneNumber,
          email: createDto.admin.email,
          nationalId: createDto.admin.nationalId,
          role: UserRole.SAVING_INSTITUTION_ADMIN,
          password: await bcrypt.hash('Default@123', 10),
        });
        const savedAdmin = await manager.save(admin);

        const savingInstitution = this.savingInstitutionRepo.create({
          name: createDto.name,
          admin: savedAdmin,
        });
        const savedSavingInstitution = await manager.save(savingInstitution);

        const token = await this.jwtService.signAsync(
          {
            userId: savedAdmin.id,
            email: savedAdmin.email,
            role: savedAdmin.role,
          },
          {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '10d',
          },
        );

        await this.tokenService.createtoken({ token, userId: savedAdmin.id });

        const setupLink = `${this.configService.get(
          'FRONTEND_BASE_URL',
        )}/set-password?token=${token}`;

        await this.emailService.sendSavingInstitutionWelcomeEmail(
          savedAdmin.email,
          savedSavingInstitution.name,
        );

        await this.emailService.sendSavingInstitutionSetupEmail(
          savedAdmin.email,
          savedSavingInstitution.name,
          setupLink,
        );

        return savedSavingInstitution;
      } catch (error) {
        throw error instanceof BadRequestException
          ? error
          : new InternalServerErrorException(
              'Failed to create service provider. Please try again.',
            );
      }
    });
  }

  /** Get all providers */
  async findAll(
    status?: SavingInstitutionStatus,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    data: SavingInstitution[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const query = this.savingInstitutionRepo
        .createQueryBuilder('savingInstitution')
        .leftJoinAndSelect('savingInstitution.admin', 'admin');

      // Filter by status if provided
      if (status) {
        query.andWhere('savingInstitution.status = :status', { status });
      }

      // Add search (by provider name or admin email/phone/name)
      if (search) {
        query.andWhere(
          `(LOWER(savingInstitution.name) LIKE :search 
           OR LOWER(admin.email) LIKE :search 
           OR LOWER(admin.firstName) LIKE :search 
           OR LOWER(admin.lastName) LIKE :search 
           OR admin.phoneNumber LIKE :search)`,
          { search: `%${search.toLowerCase()}%` },
        );
      }

      const total = await query.getCount();

      const data = await query
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('savingInstitution.createdAt', 'DESC')
        .getMany();

      return { data, total, page, limit };
    } catch (err) {
      Logger.log(err);
      throw new InternalServerErrorException(
        'Unable to fetch service providers. Please try again.',
      );
    }
  }

  /** Get one by id */
  async findOne(id: string): Promise<SavingInstitution> {
    const savingInstitution = await this.savingInstitutionRepo.findOne({
      where: { id },
      relations: ['admin', 'products'],
    });

    if (!savingInstitution)
      throw new NotFoundException('Service provider not found.');

    return savingInstitution;
  }

  /** Update service provider */
  async update(
    id: string,
    updateDto: UpdateSavingInstitutionDto,
  ): Promise<SavingInstitution> {
    return this.datasource.transaction(async (manager) => {
      const existing = await manager.findOne(SavingInstitution, {
        where: { id },
        relations: ['admin'],
      });

      if (!existing) throw new NotFoundException('Service provider not found.');

      const admin = await manager.findOne(User, {
        where: { id: existing.admin.id },
      });

      if (!admin) throw new NotFoundException('Admin user not found.');

      Object.assign(admin, {
        firstName: updateDto.admin.firstName,
        lastName: updateDto.admin.lastName,
        phoneNumber: updateDto.admin.phoneNumber,
        email: updateDto.admin.email,
        nationalId: updateDto.admin.nationalId,
      });
      await manager.save(admin);

      Object.assign(existing, {
        name: updateDto.name,
      });

      return await manager.save(existing);
    });
  }

  /** Soft delete: deactivate the provider */
  async deactivate(id: string): Promise<boolean> {
    const savingInstitution = await this.findOne(id);
    savingInstitution.status = SavingInstitutionStatus.INACTIVE;
    await this.savingInstitutionRepo.save(savingInstitution);
    return true;
  }

  /** Reactivate provider */
  async activate(id: string): Promise<boolean> {
    const savingInstitution = await this.findOne(id);
    savingInstitution.status = SavingInstitutionStatus.ACTIVE;
    await this.savingInstitutionRepo.save(savingInstitution);
    return true;
  }

  /** Permanently remove */
  async remove(id: string): Promise<boolean> {
    return this.datasource.transaction(async (manager) => {
      const existing = await manager.findOne(SavingInstitution, {
        where: { id },
        relations: ['admin'],
      });

      if (!existing) throw new NotFoundException('Service provider not found.');

      await manager.delete(User, { id: existing.admin.id });
      const result = await manager.delete(SavingInstitution, { id });
      return (result.affected || 0) > 0;
    });
  }
}
