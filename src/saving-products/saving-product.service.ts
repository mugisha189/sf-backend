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
import { SubSavingProduct } from './entities/sub-saving-product.entity';
import { CreateSubSavingProductDto } from './dto/create-sub-saving-product.dto';
import { UpdateSubSavingProductDto } from './dto/update-sub-saving-product.dto';
import { SubSavingProductStatus } from './enums/sub-saving-product-status.enum';

@Injectable()
export class SavingProductService {
  constructor(
    @InjectRepository(SavingProduct)
    private readonly productRepo: Repository<SavingProduct>,

    @InjectRepository(SavingInstitution)
    private readonly institutionRepo: Repository<SavingInstitution>,

    @InjectRepository(SubSavingProduct)
    private readonly subProductRepo: Repository<SubSavingProduct>,
  ) {}

  async create(createDto: CreateSavingProductDto): Promise<SavingProduct> {
    const savingInstitution = await this.institutionRepo.findOne({
      where: { id: createDto.savingInstitutionId },
    });
    if (!savingInstitution) {
      throw new NotFoundException('Saving institution not found.');
    }

    const savingProduct = this.productRepo.create({
      name: createDto.name,
      description: createDto.description,
      cashBackPercentage: createDto.cashBackPercentage,
      sfDividend: createDto.sfDividend,
      savingProductDividend: createDto.savingProductDividend,
      savingInstitution,
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

  async addSubProduct(
    productId: string,
    dto: CreateSubSavingProductDto,
  ): Promise<SubSavingProduct> {
    const product = await this.findOne(productId);
    const subProduct = this.subProductRepo.create({
      title: dto.title,
      amount: dto.amount,
      savingProduct: product,
    });
    return this.subProductRepo.save(subProduct);
  }

  async getSubProducts(productId: string): Promise<SubSavingProduct[]> {
    const product = await this.findOne(productId);
    return this.subProductRepo.find({
      where: { savingProduct: product },
      order: { createdAt: 'DESC' },
    });
  }

  async updateSubProduct(
    subProductId: string,
    dto: UpdateSubSavingProductDto,
  ): Promise<SubSavingProduct> {
    const subProduct = await this.subProductRepo.findOne({
      where: { id: subProductId },
    });
    if (!subProduct) throw new NotFoundException('Subproduct not found.');
    Object.assign(subProduct, dto);
    return this.subProductRepo.save(subProduct);
  }

  async activateSubProduct(subProductId: string): Promise<boolean> {
    const subProduct = await this.subProductRepo.findOne({
      where: { id: subProductId },
    });
    if (!subProduct) throw new NotFoundException('Subproduct not found.');
    subProduct.status = SubSavingProductStatus.ACTIVE;
    await this.subProductRepo.save(subProduct);
    return true;
  }

  async deactivateSubProduct(subProductId: string): Promise<boolean> {
    const subProduct = await this.subProductRepo.findOne({
      where: { id: subProductId },
    });
    if (!subProduct) throw new NotFoundException('Subproduct not found.');
    subProduct.status = SubSavingProductStatus.INACTIVE;
    await this.subProductRepo.save(subProduct);
    return true;
  }
}
