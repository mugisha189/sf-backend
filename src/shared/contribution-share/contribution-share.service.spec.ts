import { Test, TestingModule } from '@nestjs/testing';
import { ContributionShareService } from './contribution-share.service';

describe('ContributionShareService', () => {
  let service: ContributionShareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContributionShareService],
    }).compile();

    service = module.get<ContributionShareService>(ContributionShareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
