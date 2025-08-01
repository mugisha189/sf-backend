import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingProduct } from './entities/saving-product.entity';
import { CreateSavingProductDto } from './dto/create-saving-product.dto';
import { UpdateSavingProductDto } from './dto/update-saving-product.dto';
import { SavingProductStatus } from './enums/saving-product-status.enum';
import { SavingInstitution } from 'src/saving-institutions/entities/saving-institution.entity';
import { ServiceProviderProduct } from 'src/service-provider-products/entities/service-provider-product.entity';

@Injectable()
export class SavingProductService {
  constructor(
    @InjectRepository(SavingProduct)
    private readonly productRepo: Repository<SavingProduct>,

    @InjectRepository(SavingInstitution)
    private readonly institutionRepo: Repository<SavingInstitution>,

    @InjectRepository(ServiceProviderProduct)
    private readonly providerProductRepo: Repository<ServiceProviderProduct>,
  ) {}

  async create(createDto: CreateSavingProductDto): Promise<SavingProduct> {
    const savingInstitution = await this.institutionRepo.findOne({
      where: { id: createDto.savingInstitutionId },
    });
    if (!savingInstitution) {
      throw new NotFoundException('Saving institution not found.');
    }

    let serviceProviderProduct: ServiceProviderProduct | null = null;
    if (createDto.serviceProviderProductId) {
      serviceProviderProduct = await this.providerProductRepo.findOne({
        where: { id: createDto.serviceProviderProductId },
      });
      if (!serviceProviderProduct) {
        throw new NotFoundException('Service provider product not found.');
      }
    }

    const savingProduct = this.productRepo.create({
      name: createDto.name,
      description: createDto.description,
      cashBackPercentage: createDto.cashBackPercentage,
      serviceProviderDividend: createDto.serviceProviderDividend,
      sfDividend: createDto.sfDividend,
      savingProductDividend: createDto.savingProductDividend,
      savingInstitution,
      ...(serviceProviderProduct && { serviceProviderProduct }),
    });

    return this.productRepo.save(savingProduct);
  }

  async findAll(
    status?: SavingProductStatus,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    data: SavingProduct[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const query = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.savingInstitution', 'savingInstitution')
        .leftJoinAndSelect(
          'product.serviceProviderProduct',
          'serviceProviderProduct',
        );

      if (status) {
        query.andWhere('product.status = :status', { status });
      }

      if (search) {
        query.andWhere(
          `(LOWER(product.name) LIKE :search 
            OR LOWER(savingInstitution.name) LIKE :search)`,
          { search: `%${search.toLowerCase()}%` },
        );
      }

      const total = await query.getCount();

      const data = await query
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('product.createdAt', 'DESC')
        .getMany();

      return { data, total, page, limit };
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(
        'Unable to fetch saving products. Please try again.',
      );
    }
  }

  async findOne(id: string): Promise<SavingProduct> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'serviceProvider',
        'savingInstitution',
        'serviceProviderProduct',
      ],
    });

    if (!product) throw new NotFoundException('Saving product not found.');
    return product;
  }

  async update(
    id: string,
    updateDto: UpdateSavingProductDto,
  ): Promise<SavingProduct> {
    const product = await this.findOne(id);

    if (updateDto.savingInstitutionId) {
      const institution = await this.institutionRepo.findOne({
        where: { id: updateDto.savingInstitutionId },
      });
      if (!institution)
        throw new NotFoundException('Saving institution not found.');
      product.savingInstitution = institution;
    }

    if (updateDto.serviceProviderProductId) {
      const providerProduct = await this.providerProductRepo.findOne({
        where: { id: updateDto.serviceProviderProductId },
      });
      if (!providerProduct)
        throw new NotFoundException('Service provider product not found.');
      product.serviceProviderProduct = providerProduct;
    }

    Object.assign(product, updateDto);
    return this.productRepo.save(product);
  }

  async deactivate(id: string): Promise<boolean> {
    const product = await this.findOne(id);
    product.status = SavingProductStatus.INACTIVE;
    await this.productRepo.save(product);
    return true;
  }

  async activate(id: string): Promise<boolean> {
    const product = await this.findOne(id);
    product.status = SavingProductStatus.ACTIVE;
    await this.productRepo.save(product);
    return true;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Saving product not found.');
    return true;
  }
}
