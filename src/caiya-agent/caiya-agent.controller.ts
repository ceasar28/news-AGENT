import { Controller, Get } from '@nestjs/common';
import { CaiyaAgentService } from './caiya-agent.service';

@Controller('caiya-agent')
export class CaiyaAgentController {
  constructor(private readonly caiyaAgentService: CaiyaAgentService) {}

  @Get()
  getData() {
    return this.caiyaAgentService.getTrendingNews();
  }

  @Get('filtered-news')
  getParsedNews() {
    return this.caiyaAgentService.getParsedNews();
  }
}
