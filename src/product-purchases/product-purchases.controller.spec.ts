import { Test, TestingModule } from '@nestjs/testing';
import { ProductPurchasesController } from './product-purchases.controller';
import { ProductPurchasesService } from './product-purchases.service';

describe('ProductPurchasesController', () => {
  let controller: ProductPurchasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPurchasesController],
      providers: [ProductPurchasesService],
    }).compile();

    controller = module.get<ProductPurchasesController>(ProductPurchasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
