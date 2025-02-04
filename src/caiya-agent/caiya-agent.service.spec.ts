import { Test, TestingModule } from '@nestjs/testing';
import { CaiyaAgentService } from './caiya-agent.service';

describe('CaiyaAgentService', () => {
  let service: CaiyaAgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaiyaAgentService],
    }).compile();

    service = module.get<CaiyaAgentService>(CaiyaAgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
