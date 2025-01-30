import { Test, TestingModule } from '@nestjs/testing';
import { SavingProductService } from './saving-product.service';

describe('SavingProductService', () => {
  let service: SavingProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavingProductService],
    }).compile();

    service = module.get<SavingProductService>(SavingProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
