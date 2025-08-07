import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cooperative } from './entities/cooperative.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entity/users.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { EmailService } from 'src/email/email.service';
import { CooperativeStatus } from './enums/cooperative-status.enum';
import { AddMembersDto } from './dto/add-member.dto';
import { UserCooperative } from 'src/users/entity/user-cooperative.entity';
import { UserCooperativeRole } from 'src/users/enum/user-cooperative-role.enum';
import { UserCooperativeStatus } from 'src/users/enum/user-cooperative-status.enum';
import { UserRole } from 'src/constants/role.enum';

@Injectable()
export class CooperativeService {
  constructor(
    @InjectRepository(Cooperative)
    private cooperativeRepo: Repository<Cooperative>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(UserCooperative)
    private userCooperativeRepo: Repository<UserCooperative>,

    private datasource: DataSource,
    private configService: ConfigService,
    private tokenService: TokenService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateCooperativeDto): Promise<Cooperative> {
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
        role: UserRole.USER,
        password: await bcrypt.hash('', 10),
      });

      const savedAdmin = await queryRunner.manager.save(admin);

      const cooperative = this.cooperativeRepo.create({
        name: createDto.name,
        village: createDto.village,
        cell: createDto.cell,
        sector: createDto.sector,
        district: createDto.district,
        province: createDto.province,
        description: createDto.description || '',
        status: CooperativeStatus.ACTIVE,
      });

      const savedCooperative = await queryRunner.manager.save(cooperative);

      const userCoop = this.userCooperativeRepo.create({
        user: savedAdmin,
        cooperative: savedCooperative,
        role: UserCooperativeRole.PRESIDENT,
        status: UserCooperativeStatus.ACTIVE,
      });

      await queryRunner.manager.save(userCoop);

      const token = await this.jwtService.signAsync(
        {
          userId: savedAdmin.id,
          email: savedAdmin.email,
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

      await this.emailService.sendCooperativeWelcomeEmail(
        savedCooperative.name,
        savedAdmin.email || '',
      );

      await this.emailService.sendCooperativeSetupEmail(
        savedCooperative.name,
        setupLink,
        savedAdmin.email || '',
      );

      await queryRunner.commitTransaction();
      return savedCooperative;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to create cooperative.');
    } finally {
      await queryRunner.release();
    }
  }

  // async addMembers(coopId: string, dto: AddMembersDto): Promise<User[]> {
  //   const cooperative = await this.cooperativeRepo.findOne({
  //     where: { id: coopId },
  //   });

  //   if (!cooperative) throw new NotFoundException('Cooperative not found.');

  //   const newUsers: User[] = [];

  //   for (const memberDto of dto.members) {
  //     const existingUser = await this.userRepo.findOne({
  //       where: { email: memberDto.email },
  //     });

  //     if (existingUser) {
  //       const existingMembership = await this.userCooperativeRepo.findOne({
  //         where: {
  //           user: { id: existingUser.id },
  //           cooperative: { id: coopId },
  //         },
  //         relations: ['user', 'cooperative'],
  //       });

  //       if (existingMembership) {
  //         throw new BadRequestException(
  //           `User with email ${memberDto.email} is already a member of this cooperative.`,
  //         );
  //       }

  //       const userCoop = this.userCooperativeRepo.create({
  //         user: existingUser,
  //         cooperative,
  //         role: UserCooperativeRole.MEMBER,
  //         status: UserCooperativeStatus.ACTIVE,
  //       });

  //       await this.userCooperativeRepo.save(userCoop);

  //       await this.emailService.sendCooperativeWelcomeEmail(
  //         cooperative.name,
  //         existingUser.email || '',
  //       );

  //       newUsers.push(existingUser);
  //     } else {
  //       const newUser = this.userRepo.create({
  //         ...memberDto,
  //         role: UserRole.USER,
  //         password: await bcrypt.hash('Default@123', 10),
  //       });

  //       const savedUser = await this.userRepo.save(newUser);

  //       const userCoop = this.userCooperativeRepo.create({
  //         user: savedUser,
  //         cooperative,
  //         role: UserCooperativeRole.MEMBER,
  //         status: UserCooperativeStatus.ACTIVE,
  //       });

  //       await this.userCooperativeRepo.save(userCoop);

  //       await this.emailService.sendCooperativeWelcomeEmail(
  //         cooperative.name,
  //         savedUser.email || '',
  //       );

  //       newUsers.push(savedUser);
  //     }
  //   }

  //   return newUsers;
  // }

  async addMembers(coopId: string, dto: AddMembersDto): Promise<User[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const newUsers: User[] = [];

    try {
      const cooperative = await queryRunner.manager.findOne(Cooperative, {
        where: { id: coopId },
      });

      if (!cooperative) {
        throw new NotFoundException('Cooperative not found.');
      }

      for (const memberDto of dto.members) {
        let user = await queryRunner.manager.findOne(User, {
          where: { email: memberDto.email },
        });

        if (user) {
          const existingMembership = await queryRunner.manager.findOne(
            UserCooperative,
            {
              where: {
                user: { id: user.id },
                cooperative: { id: coopId },
              },
              relations: ['user', 'cooperative'],
            },
          );

          if (existingMembership) {
            throw new BadRequestException(
              `User with email ${memberDto.email} is already a member of this cooperative.`,
            );
          }
        } else {
          const defaultPassword = this.configService.get<string>(
            'DEFAULT_USER_PASSWORD',
          );
          if (!defaultPassword)
            throw new BadRequestException('No default password for USER set');

          user = queryRunner.manager.create(User, {
            ...memberDto,
            role: UserRole.USER,
            cooperativeContributionAmount: memberDto.contributionAmount,
            password: await bcrypt.hash(defaultPassword, 10),
          });

          user = await queryRunner.manager.save(User, user);
        }

        const userCoop = queryRunner.manager.create(UserCooperative, {
          user,
          cooperative,
          contributionAmount: 0,
          role: UserCooperativeRole.MEMBER,
          status: UserCooperativeStatus.ACTIVE,
        });

        await queryRunner.manager.save(UserCooperative, userCoop);
        newUsers.push(user);
      }

      await queryRunner.commitTransaction();

      // Send emails **after transaction** to avoid blocking writes if email fails
      for (const user of newUsers) {
        await this.emailService.sendCooperativeWelcomeEmail(
          cooperative.name,
          user.email || '',
        );
      }

      return newUsers;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getMembers(coopId: string): Promise<User[]> {
    const links = await this.userCooperativeRepo.find({
      where: { cooperative: { id: coopId } },
      relations: ['user'],
    });

    return links.map((uc) => uc.user);
  }

  async removeMember(coopId: string, userId: string): Promise<boolean> {
    const link = await this.userCooperativeRepo.findOne({
      where: { cooperative: { id: coopId }, user: { id: userId } },
    });

    if (!link)
      throw new NotFoundException('User not found in this cooperative.');

    await this.userCooperativeRepo.remove(link);
    return true;
  }

  async findAll(
    status?: CooperativeStatus,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    data: (Cooperative & { admin: User | null })[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = this.cooperativeRepo.createQueryBuilder('cooperative');

    if (status) {
      query.andWhere('cooperative.status = :status', { status });
    }

    if (search) {
      query.andWhere('LOWER(cooperative.name) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const total = await query.getCount();

    const cooperatives = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('cooperative.createdAt', 'DESC')
      .getMany();

    const data = await Promise.all(
      cooperatives.map(async (coop) => {
        const presidentLink = await this.userCooperativeRepo
          .createQueryBuilder('userCooperative')
          .leftJoinAndSelect('userCooperative.user', 'user')
          .where('userCooperative.cooperativeId = :coopId', { coopId: coop.id })
          .andWhere('userCooperative.role = :role', { role: 'PRESIDENT' })
          .getOne();

        return {
          ...coop,
          admin: presidentLink?.user || null,
        };
      }),
    );

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Cooperative> {
    const cooperative = await this.cooperativeRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!cooperative)
      throw new NotFoundException('Service provider not found.');

    return cooperative;
  }

  async update(id: string, dto: UpdateCooperativeDto): Promise<Cooperative> {
    const cooperative = await this.cooperativeRepo.findOne({
      where: { id },
    });

    if (!cooperative) throw new NotFoundException('Cooperative not found.');

    Object.assign(cooperative, {
      name: dto.name,
      village: dto.village,
      cell: dto.cell,
      sector: dto.sector,
      district: dto.district,
      province: dto.province,
      description: dto.description,
    });

    return await this.cooperativeRepo.save(cooperative);
  }

  async deactivate(id: string): Promise<boolean> {
    const cooperative = await this.findOne(id);
    cooperative.status = CooperativeStatus.INACTIVE;
    await this.cooperativeRepo.save(cooperative);
    return true;
  }

  async activate(id: string): Promise<boolean> {
    const cooperative = await this.findOne(id);
    cooperative.status = CooperativeStatus.ACTIVE;
    await this.cooperativeRepo.save(cooperative);
    return true;
  }

  async remove(id: string): Promise<boolean> {
    return this.datasource.transaction(async (manager) => {
      const cooperative = await manager.findOne(Cooperative, {
        where: { id },
        relations: ['members'],
      });

      if (!cooperative) throw new NotFoundException('Cooperative not found.');

      await manager.delete(UserCooperative, {
        cooperative: { id },
      });

      const result = await manager.delete(Cooperative, { id });
      return (result.affected || 0) > 0;
    });
  }
}
