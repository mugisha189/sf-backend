import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Saving } from './entities/saving.entity';
import { CreateSavingDto } from './dto/create-saving.dto';
import { SavingStatus } from './enums/saving-status.enum';
import { SavingInstitution } from 'src/saving-institutions/entities/saving-institution.entity';
import { User } from 'src/users/entity/users.entity';
import { SavingProductType } from 'src/saving-products/enums/saving-product-type.enum';
import { ServiceProvider } from 'src/service-provider/entities/service-provider.entity';
import { SubSavingProduct } from 'src/saving-products/entities/sub-saving-product.entity';
import { SavingProduct } from 'src/saving-products/entities/saving-product.entity';
import { UserCooperative } from 'src/users/entity/user-cooperative.entity';
import { UserCooperativeRole } from 'src/users/enum/user-cooperative-role.enum';
import { SavingProductStatus } from 'src/saving-products/enums/saving-product-status.enum';
import { UserRole } from 'src/constants/role.enum';

@Injectable()
export class SavingService {
  constructor(
    @InjectRepository(Saving)
    private readonly savingRepo: Repository<Saving>,

    @InjectRepository(SavingInstitution)
    private readonly institutionRepo: Repository<SavingInstitution>,

    @InjectRepository(SavingProduct)
    private readonly savingProductRepo: Repository<SavingProduct>,

    @InjectRepository(SubSavingProduct)
    private readonly subProductRepo: Repository<SubSavingProduct>,

    @InjectRepository(ServiceProvider)
    private readonly serviceProviderRepo: Repository<ServiceProvider>,

    @InjectRepository(UserCooperative)
    private readonly userCooperativeRepo: Repository<UserCooperative>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(
    createDto: CreateSavingDto,
    currentUserId: string,
  ): Promise<Saving | Saving[]> {
    const user = await this.userRepo.findOne({ where: { id: currentUserId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (createDto.type === SavingProductType.AIRTIME) {
      const subProduct = await this.subProductRepo.findOne({
        where: { id: createDto.subProductId },
        relations: ['savingProduct', 'savingProduct.savingInstitution'],
      });

      if (!subProduct || !subProduct.savingProduct) {
        throw new NotFoundException(
          'Sub-product or related saving product not found.',
        );
      }

      const product = subProduct.savingProduct;
      const amount =
        subProduct.amount * (product.savingInstitutionDividend / 100);
      const saving = this.savingRepo.create({
        amount,
        user,
        savingInstitution: product.savingInstitution,
        type: SavingProductType.AIRTIME,
      });

      const saved = await this.savingRepo.save(saving);

      // await this.placeholderActionService.createSfDividends(
      //   saved,
      //   product.sfDividends,
      // );
      // await this.placeholderActionService.createServiceProviderDividends(
      //   saved,
      //   product.serviceProviderDividends,
      // );

      return saved;
    }

    if (
      createDto.type === SavingProductType.SHOP_SAVING &&
      typeof createDto.shopCode === 'string' &&
      /^\d+$/.test(createDto.shopCode)
    ) {
      const serviceProvider = await this.serviceProviderRepo.findOne({
        where: { code: parseInt(createDto.shopCode, 10) },
      });

      if (!serviceProvider) {
        throw new NotFoundException('Service provider not found.');
      }

      const activeProduct = await this.savingProductRepo.findOne({
        where: {
          serviceProvider: { id: serviceProvider.id },
          status: SavingProductStatus.ACTIVE,
        },
        relations: ['savingInstitution'],
      });

      if (!activeProduct) {
        throw new NotFoundException(
          'Active saving product not found for service provider.',
        );
      }

      const amount =
        ((createDto.amount || 0) *
          Number(activeProduct.savingInstitutionDividend)) /
        100;

      const saving = this.savingRepo.create({
        amount,
        user,
        savingInstitution: activeProduct.savingInstitution,
        type: SavingProductType.SHOP_SAVING,
      });

      const saved = await this.savingRepo.save(saving);

      // await this.placeholderActionService.createSfDividends(saved, Number(activeProduct.sfDividend));
      // await this.placeholderActionService.createServiceProviderDividends(saved, Number(activeProduct.serviceProviderDividend));

      return saved;
    }

    if (createDto.type === SavingProductType.COOPERATIVE_SAVING) {
      const presidentMembership = await this.userCooperativeRepo.findOne({
        where: {
          user: { id: currentUserId },
          role: UserCooperativeRole.PRESIDENT,
        },
        relations: ['cooperative'],
      });

      if (!presidentMembership || !presidentMembership.cooperative) {
        throw new NotFoundException('User is not a cooperative president.');
      }

      const cooperative = presidentMembership.cooperative;

      const members = await this.userCooperativeRepo.find({
        where: { cooperative: { id: cooperative.id } },
        relations: ['user'],
      });

      const product = await this.savingProductRepo.findOne({
        where: { id: createDto.savingProductId },
        relations: ['savingInstitution'],
      });

      if (!product) {
        throw new NotFoundException('Saving product not found.');
      }

      const savings: Saving[] = [];

      for (const member of members) {
        const saving = this.savingRepo.create({
          amount: member.amount,
          user: member.user,
          savingInstitution: product.savingInstitution,
          type: SavingProductType.COOPERATIVE_SAVING,
        });

        const saved = await this.savingRepo.save(saving);
        savings.push(saved);
      }

      return savings;
    }

    if (createDto.type === SavingProductType.INDIVIDUAL_SAVING) {
      const product = await this.savingProductRepo.findOne({
        where: { id: createDto.savingProductId },
        relations: ['savingInstitution'],
      });

      if (!product) {
        throw new NotFoundException('Saving product not found.');
      }

      const saving = this.savingRepo.create({
        amount: createDto.amount,
        user,
        savingInstitution: product.savingInstitution,
        type: SavingProductType.INDIVIDUAL_SAVING,
      });

      return await this.savingRepo.save(saving);
    }

    // if (createDto.type === SavingProductType.OTHER) {
    //   const saving = this.savingRepo.create({
    //     amount: 0,
    //     user,
    //     savingInstitution: null,
    //     type: SavingProductType.OTHER,
    //   });

    //   return await this.savingRepo.save(saving);
    // }

    throw new BadRequestException('Unsupported saving type.');
  }

  async findAll(params: {
    status?: SavingStatus;
    type?: SavingProductType;
    page: number;
    limit: number;
    search?: string;
    currentUser: User & { userId: string };
  }): Promise<{
    data: Saving[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { status, type, page, limit, search, currentUser } = params;

    try {
      const query = this.savingRepo
        .createQueryBuilder('saving')
        .leftJoinAndSelect('saving.savingInstitution', 'institution')
        .leftJoinAndSelect('saving.user', 'user');

      // Filter by status
      if (status) {
        query.andWhere('saving.status = :status', { status });
      }

      // Filter by type
      if (type) {
        query.andWhere('saving.type = :type', { type });
      }

      // Filter by search keyword
      if (search) {
        query.andWhere(
          `(LOWER(institution.name) LIKE :search OR LOWER(user.firstName) LIKE :search OR LOWER(user.lastName) LIKE :search)`,
          { search: `%${search.toLowerCase()}%` },
        );
      }

      // Role-based filtering
      if (currentUser.role === UserRole.USER) {
        query.andWhere('user.id = :userId', {
          userId: currentUser.userId,
        });
      }

      const total = await query.getCount();

      const data = await query
        .orderBy('saving.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return { data, total, page, limit };
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(
        'Unable to fetch savings. Please try again.',
      );
    }
  }

  async findOne(id: string): Promise<Saving> {
    const product = await this.savingRepo.findOne({
      where: { id },
      relations: ['user', 'savingInstitution'],
    });

    if (!product) throw new NotFoundException('Saving product not found.');
    return product;
  }

  async deactivate(id: string): Promise<boolean> {
    const product = await this.findOne(id);
    product.status = SavingStatus.INACTIVE;
    await this.savingRepo.save(product);
    return true;
  }

  async activate(id: string): Promise<boolean> {
    const product = await this.findOne(id);
    product.status = SavingStatus.ACTIVE;
    await this.savingRepo.save(product);
    return true;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.savingRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Saving product not found.');
    return true;
  }
}
