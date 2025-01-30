import { Test, TestingModule } from '@nestjs/testing';
import { PartnerCompanyService } from './partner-company.service';

describe('PartnerCompanyService', () => {
  let service: PartnerCompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerCompanyService],
    }).compile();

    service = module.get<PartnerCompanyService>(PartnerCompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
