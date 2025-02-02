import { Test, TestingModule } from '@nestjs/testing';
import { ProductPurchasesService } from './product-purchases.service';

describe('ProductPurchasesService', () => {
  let service: ProductPurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPurchasesService],
    }).compile();

    service = module.get<ProductPurchasesService>(ProductPurchasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
