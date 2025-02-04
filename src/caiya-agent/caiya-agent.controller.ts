import { Controller, Get } from '@nestjs/common';
import { CaiyaAgentService } from './caiya-agent.service';

@Controller('filtered-news')
export class CaiyaAgentController {
  constructor(private readonly caiyaAgentService: CaiyaAgentService) {}

  //   @Get()
  //   getData() {
  //     return this.caiyaAgentService.getTrendingNews();
  //   }

  @Get()
  getParsedNews() {
    return this.caiyaAgentService.getParsedNews();
  }
}
