import { Test, TestingModule } from '@nestjs/testing';
import { CooperativeSavingsController } from './cooperative-savings.controller';
import { CooperativeSavingsService } from './cooperative-savings.service';

describe('CooperativeSavingsController', () => {
  let controller: CooperativeSavingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CooperativeSavingsController],
      providers: [CooperativeSavingsService],
    }).compile();

    controller = module.get<CooperativeSavingsController>(
      CooperativeSavingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
