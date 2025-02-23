import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingProduct } from './entities/saving-product.entity';
import { EntryPoint } from './entities/entry-points.entity';
import { CreateSavingProductDto } from './dto/create-saving-product.dto';
import { UpdateSavingProductDto } from './dto/update-saving-product.dto';
import { PartnerCompany } from 'src/partner-company/entities/partner-company.entity';
import { CompanyProduct } from 'src/company-products/entities/company-product.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class SavingProductService {
  constructor(
    @InjectRepository(SavingProduct) private savingProductRepo: Repository<SavingProduct>,
    @InjectRepository(EntryPoint) private entryPointRepo: Repository<EntryPoint>,
    @InjectRepository(PartnerCompany) private partnerCompanyRepo: Repository<PartnerCompany>,
    @InjectRepository(CompanyProduct) private companyProductRepo: Repository<CompanyProduct>,
    private cloudinaryService: CloudinaryService
  ) { }

  async create(createSavingProductDto: CreateSavingProductDto, productLogo: Express.Multer.File): Promise<SavingProduct> {
    try {
      const { companyId, entryPoints, ...savingProductData } = createSavingProductDto;

      const company = await this.partnerCompanyRepo.findOne({ where: { id: companyId } });
      if (!company) throw new NotFoundException('Company not found');

      const logo = await this.cloudinaryService.uploadFile(productLogo, "saving-products");

      const savingProduct = this.savingProductRepo.create({
        ...savingProductData,
        company,
        productLogo: logo.imageUrl
      });

      const savedProduct = await this.savingProductRepo.save(savingProduct);

      const entryPointEntities = await Promise.all(
        entryPoints.map(async (entryPoint) => {
          const product = await this.companyProductRepo.findOne({ where: { id: entryPoint.productId } });
          if (!product) throw new NotFoundException(`Company Product not found for ID: ${entryPoint.productId}`);

          return this.entryPointRepo.create({ ...entryPoint, product, savingProduct: savedProduct });
        })
      );

      await this.entryPointRepo.save(entryPointEntities);

      return savedProduct;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<SavingProduct[]> {
    return this.savingProductRepo.find({ where: { deleted: false }, relations: ['entryPoints', 'company'] });
  }

  async findOne(id: string): Promise<SavingProduct> {
    const savingProduct = await this.savingProductRepo.findOne({
      where: { id, deleted: false },
      relations: ['entryPoints', 'company'],
    });
    if (!savingProduct) throw new NotFoundException('Saving product not found');
    return savingProduct;
  }

  async update(id: string, updateSavingProductDto: UpdateSavingProductDto, productLogo?: Express.Multer.File): Promise<SavingProduct> {
    const existingProduct = await this.savingProductRepo.findOne({ where: { id, deleted: false } });
    if (!existingProduct) throw new NotFoundException('Saving product not found');

    let logoUrl = existingProduct.productLogo;
    if (productLogo) {
      const logo = await this.cloudinaryService.uploadFile(productLogo, "saving-products");
      logoUrl = logo.imageUrl;
    }

    if (updateSavingProductDto.entryPoints) {
      const { entryPoints } = updateSavingProductDto;
      const existingEntryPoints = existingProduct.entryPoints || [];

      const entryPointEntities = await Promise.all(
        entryPoints.map(async (entryPoint) => {
          const product = await this.companyProductRepo.findOne({ where: { id: entryPoint.productId } });
          if (!product) throw new NotFoundException(`Company Product not found for ID: ${entryPoint.productId}`);

          const existingEntryPoint = existingEntryPoints.find((ep) => ep.id === entryPoint.id);
          if (existingEntryPoint) {
            Object.assign(existingEntryPoint, entryPoint);
            return this.entryPointRepo.save(existingEntryPoint);
          }

          return this.entryPointRepo.create({ ...entryPoint, product, savingProduct: existingProduct });
        })
      );

      await this.entryPointRepo.save(entryPointEntities);
    }

    await this.savingProductRepo.update(id, { ...updateSavingProductDto, productLogo: logoUrl });

    return this.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.savingProductRepo.findOne({ where: { id, deleted: false } });
    if (!product) throw new NotFoundException('Saving product not found');

    await this.savingProductRepo.update(id, { deleted: true });

    return true;
  }

  async deleteEntryPoint(id: string): Promise<boolean> {
    const entryPoint = await this.entryPointRepo.findOne({ where: { id, deleted: false } });
    if (!entryPoint) throw new NotFoundException('EntryPoint not found');

    await this.entryPointRepo.update(id, { deleted: true });

    return true;
  }
}
