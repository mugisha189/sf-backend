import { Test, TestingModule } from '@nestjs/testing';
import { SavingProductController } from './saving-product.controller';
import { SavingProductService } from './saving-product.service';

describe('SavingProductController', () => {
  let controller: SavingProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavingProductController],
      providers: [SavingProductService],
    }).compile();

    controller = module.get<SavingProductController>(SavingProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
