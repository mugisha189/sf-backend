import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProviderProduct } from './entities/service-provider-product.entity';
import { ServiceProvider } from 'src/service-provider/entities/service-provider.entity';
import { CreateServiceProviderProductDto } from './dto/create-service-provider-product.dto';
import { UpdateServiceProviderProductDto } from './dto/update-service-provider-product.dto';
import { ServiceProviderProductStatus } from './enums/service-provider-product-status.enum';

@Injectable()
export class ServiceProviderProductService {
  constructor(
    @InjectRepository(ServiceProviderProduct)
    private readonly productRepo: Repository<ServiceProviderProduct>,

    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
  ) {}

  /** Create product for a service provider */
  async create(
    createDto: CreateServiceProviderProductDto,
  ): Promise<ServiceProviderProduct> {
    const provider = await this.providerRepo.findOne({
      where: { id: createDto.serviceProviderId },
    });
    if (!provider) throw new NotFoundException('Service provider not found.');

    const product = this.productRepo.create({
      name: createDto.name,
      description: createDto.description,
      min: createDto.min,
      max: createDto.max,
      serviceProvider: provider,
    });

    return this.productRepo.save(product);
  }

  /** Get all products */
  async findAll(
    status?: ServiceProviderProductStatus,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    data: ServiceProviderProduct[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const query = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.serviceProvider', 'serviceProvider');

      if (status) {
        query.andWhere('product.status = :status', { status });
      }

      if (search) {
        query.andWhere(
          `(LOWER(product.name) LIKE :search 
           OR LOWER(serviceProvider.name) LIKE :search)`,
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
        'Unable to fetch service provider products. Please try again.',
      );
    }
  }

  /** Get one product */
  async findOne(id: string): Promise<ServiceProviderProduct> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['serviceProvider'],
    });

    if (!product)
      throw new NotFoundException('Service provider product not found.');

    return product;
  }

  /** Update product */
  async update(
    id: string,
    updateDto: UpdateServiceProviderProductDto,
  ): Promise<ServiceProviderProduct> {
    const product = await this.findOne(id);

    if (updateDto.serviceProviderId) {
      const provider = await this.providerRepo.findOne({
        where: { id: updateDto.serviceProviderId },
      });
      if (!provider) throw new NotFoundException('Service provider not found.');
      product.serviceProvider = provider;
    }

    Object.assign(product, updateDto);

    return this.productRepo.save(product);
  }

  /** Deactivate product */
  async deactivate(id: string): Promise<boolean> {
    const product = await this.findOne(id);
    product.status = ServiceProviderProductStatus.INACTIVE;
    await this.productRepo.save(product);
    return true;
  }

  /** Activate product */
  async activate(id: string): Promise<boolean> {
    const product = await this.findOne(id);
    product.status = ServiceProviderProductStatus.ACTIVE;
    await this.productRepo.save(product);
    return true;
  }

  /** Permanently remove */
  async remove(id: string): Promise<boolean> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Service provider product not found.');
    return true;
  }
}
