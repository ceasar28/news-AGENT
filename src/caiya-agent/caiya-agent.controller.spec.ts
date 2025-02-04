import { Test, TestingModule } from '@nestjs/testing';
import { CaiyaAgentController } from './caiya-agent.controller';

describe('CaiyaAgentController', () => {
  let controller: CaiyaAgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaiyaAgentController],
    }).compile();

    controller = module.get<CaiyaAgentController>(CaiyaAgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
