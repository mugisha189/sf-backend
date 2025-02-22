import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductPurchaseDto } from './dto/create-product-purchase.dto';
import { UpdateProductPurchaseDto } from './dto/update-product-purchase.dto';
import { ProductPurchase } from './entities/product-purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerCompany } from 'src/partner-company/entities/partner-company.entity';
import { UserRole } from 'src/constants/role.enum';

@Injectable()
export class ProductPurchasesService {
  constructor(
    @InjectRepository(ProductPurchase) private productPurchaseRepo: Repository<ProductPurchase>,
    @InjectRepository(PartnerCompany) private partnerCompanyRepo: Repository<PartnerCompany>,

  ) { }
  async create(createProductPurchaseDto: CreateProductPurchaseDto): Promise<ProductPurchase> {
    try {
      // Create the product purchase
      const purchased = new ProductPurchase(createProductPurchaseDto)
      return await this.productPurchaseRepo.save(purchased)
    } catch (error) {
      throw error
    }
  }

  // async findAll(req: any): Promise<ProductPurchase[]> {
  //   try {
  //     let purchases: ProductPurchase[] = []

  //     // Company admin can only see purchase related to his company only
  //     if (req.user.role === UserRole.COMPANY_ADMIN) {

  //       console.log('the request ', req.user.email);
  //       const partnerCompany = await this.partnerCompanyRepo.findOne({ where: {  adminEmail: req.user.email } })
  //       if (!partnerCompany) throw new BadRequestException("The admin not found")
  //       console.log('partner company ', partnerCompany);
  //       purchases = await this.productPurchaseRepo.find({
  //         where: {
  //           companyName: partnerCompany.companyName,
  //           companyType: partnerCompany.companyType
  //         }
  //       })

  //     }

  //     // Super admin can see all purchases
  //     if (req.user.role === UserRole.SUPER_ADMIN) {
  //       purchases = await this.productPurchaseRepo.find()
  //     }

  //     return purchases

  //   } catch (error) {
  //     throw error
  //   }
  // }

  async findOne(id: string, req: any): Promise<ProductPurchase> {
    try {
      // Subscriber can't see purchase
      if (req.user.role === UserRole.SUBSCRIBER) {
        throw new ForbiddenException("SUBSCRIBER can't see purchases")
      }
      // Check if purchase was recorded
      let purchase = await this.productPurchaseRepo.findOneBy({ id })
      if (!purchase) throw new NotFoundException("Product purchase not found")

      // Return the purchase if matches the company of the admin
      if (req.user.role === UserRole.COMPANY_ADMIN) {
        const adminCompany = this.partnerCompanyRepo.find({
          where: {
            companyName: purchase.companyName,
            companyType: purchase.companyType
          }
        })

        if (!adminCompany) throw new ForbiddenException("You can only see purchases of your company")

      }

      return purchase;
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateProductPurchaseDto: UpdateProductPurchaseDto, req: any): Promise<ProductPurchase> {
    try {

      // Subscriber can't see purchase
      if (req.user.role === UserRole.SUBSCRIBER) {
        throw new ForbiddenException("SUBSCRIBER can't updated purchases")
      }

      // Check if the purchase was recorded
      const toBeUpdated = await this.productPurchaseRepo.findOneBy({ id })
      if (!toBeUpdated) throw new NotFoundException("Product purchase not found")

      // Company admin can only update purchases of his company only
      if (req.user.role === UserRole.COMPANY_ADMIN) {
        const adminCompany = this.partnerCompanyRepo.find({
          where: {
            companyName: toBeUpdated.companyName,
            companyType: toBeUpdated.companyType
          }
        })

        if (!adminCompany) throw new ForbiddenException("You can only update purchases of your company")
      }

      // Now update the purchase record
      toBeUpdated.companyName = updateProductPurchaseDto.companyName
      toBeUpdated.companyType = updateProductPurchaseDto.companyType
      toBeUpdated.ejoHezaAmount = updateProductPurchaseDto.ejoHezaAmount
      toBeUpdated.product = updateProductPurchaseDto.product
      toBeUpdated.productAmount = updateProductPurchaseDto.productAmount
      toBeUpdated.savingProductName = updateProductPurchaseDto.savingProductName
      toBeUpdated.sfAmount = updateProductPurchaseDto.sfAmount
      toBeUpdated.trxAmount = updateProductPurchaseDto.trxAmount

      // Save the update purchase record
      const updated = this.productPurchaseRepo.save(toBeUpdated)
      return updated;
    } catch (error) {
      throw error
    }
  }

  async remove(id: string, req: any): Promise<Boolean> {
    try {
      // Check if purchase record exists
      const toBeDeleted = await this.productPurchaseRepo.findOne({ where: { id } })
      if (!toBeDeleted) throw new NotFoundException("Purchase not found")

      // Company admin can only delete purchase records of his company only
      if (req.user.role === UserRole.COMPANY_ADMIN) {
        const adminCompany = await this.productPurchaseRepo.findOne({
          where: {
            companyName: toBeDeleted.companyName,
            companyType: toBeDeleted.companyType
          }
        })

        if (!adminCompany) throw new ForbiddenException("You can only delete purchases of your company")

      }
      
      const isDeleted = await this.productPurchaseRepo.delete(id)
      return isDeleted.affected !== 0;
    } catch (error) {
      throw error
    }
  }

  async removeAll(): Promise<Boolean> {
    try {

      const areDeleted = await this.productPurchaseRepo.delete({})
      return areDeleted.affected !== 0;
    } catch (error) {
      throw error
    }
  }
}
