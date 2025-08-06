import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/update-service-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceProvider } from './entities/service-provider.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entity/users.entity';
import { UserRole } from 'src/constants/role.enum';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { EmailService } from 'src/email/email.service';
import { ServiceProviderStatus } from './enums/service-provider-status.enum';

@Injectable()
export class ServiceProviderService {
  constructor(
    @InjectRepository(ServiceProvider)
    private serviceProviderRepo: Repository<ServiceProvider>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private datasource: DataSource,
    private configService: ConfigService,
    private tokenService: TokenService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  /** Create service provider with admin user */
  async create(createDto: CreateServiceProviderDto): Promise<ServiceProvider> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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
        role: UserRole.SERVICE_PROVIDER_ADMIN,
        password: await bcrypt.hash('Default@123', 10),
      });

      const savedAdmin = await queryRunner.manager.save(admin);

      const result: { max: string | null } | undefined =
        await queryRunner.manager
          .createQueryBuilder(ServiceProvider, 'sp')
          .select('MAX(sp.code)', 'max')
          .getRawOne();

      const maxCode = result?.max ? parseInt(result.max, 10) : 0;
      const nextCode = maxCode + 1;

      const serviceProvider = this.serviceProviderRepo.create({
        name: createDto.name,
        type: createDto.companyType,
        admin: savedAdmin,
        code: nextCode,
      });

      const savedProvider = await queryRunner.manager.save(serviceProvider);

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

      await this.tokenService.createtoken({
        token,
        userId: savedAdmin.id,
      });

      const setupLink = `${this.configService.get(
        'FRONTEND_BASE_URL',
      )}/set-password?token=${token}`;

      await this.emailService.sendServiceProviderWelcomeEmail(
        savedProvider.name,
        savedAdmin.email || '',
      );

      await this.emailService.sendServiceProviderSetupEmail(
        savedProvider.name,
        setupLink,
        savedAdmin.email || '',
      );

      await queryRunner.commitTransaction();
      return savedProvider;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException(
            'Failed to create service provider. Please try again.',
          );
    } finally {
      await queryRunner.release();
    }
  }

  /** Get all providers */
  async findAll(
    status?: ServiceProviderStatus,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    data: ServiceProvider[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const query = this.serviceProviderRepo
        .createQueryBuilder('serviceProvider')
        .leftJoinAndSelect('serviceProvider.admin', 'admin');

      // Filter by status if provided
      if (status) {
        query.andWhere('serviceProvider.status = :status', { status });
      }

      // Add search (by provider name or admin email/phone/name)
      if (search) {
        query.andWhere(
          `(LOWER(serviceProvider.name) LIKE :search 
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
        .orderBy('serviceProvider.createdAt', 'DESC')
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
  async findOne(id: string): Promise<ServiceProvider> {
    const serviceProvider = await this.serviceProviderRepo.findOne({
      where: { id },
      relations: ['admin', 'products'],
    });

    if (!serviceProvider)
      throw new NotFoundException('Service provider not found.');

    return serviceProvider;
  }

  /** Update service provider */
  async update(
    id: string,
    updateDto: UpdateServiceProviderDto,
  ): Promise<ServiceProvider> {
    return this.datasource.transaction(async (manager) => {
      const existing = await manager.findOne(ServiceProvider, {
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
        type: updateDto.companyType,
      });

      return await manager.save(existing);
    });
  }

  /** Soft delete: deactivate the provider */
  async deactivate(id: string): Promise<boolean> {
    const serviceProvider = await this.findOne(id);
    serviceProvider.status = ServiceProviderStatus.INACTIVE;
    await this.serviceProviderRepo.save(serviceProvider);
    return true;
  }

  /** Reactivate provider */
  async activate(id: string): Promise<boolean> {
    const serviceProvider = await this.findOne(id);
    serviceProvider.status = ServiceProviderStatus.ACTIVE;
    await this.serviceProviderRepo.save(serviceProvider);
    return true;
  }

  /** Permanently remove */
  async remove(id: string): Promise<boolean> {
    return this.datasource.transaction(async (manager) => {
      const existing = await manager.findOne(ServiceProvider, {
        where: { id },
        relations: ['admin'],
      });

      if (!existing) throw new NotFoundException('Service provider not found.');

      await manager.delete(User, { id: existing.admin.id });
      const result = await manager.delete(ServiceProvider, { id });
      return (result.affected || 0) > 0;
    });
  }
}
