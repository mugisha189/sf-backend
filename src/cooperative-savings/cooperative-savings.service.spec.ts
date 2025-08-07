import { Test, TestingModule } from '@nestjs/testing';
import { CoopSavingsService } from './cooperative-savings.service';

describe('CoopSavingsService', () => {
  let service: CoopSavingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoopSavingsService],
    }).compile();

    service = module.get<CoopSavingsService>(CoopSavingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
