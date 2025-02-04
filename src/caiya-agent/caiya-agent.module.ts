import { Module } from '@nestjs/common';
import { CaiyaAgentService } from './caiya-agent.service';
import { CaiyaAgentController } from './caiya-agent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from 'src/database/schemas/news.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    HttpModule,
  ],
  providers: [CaiyaAgentService],
  controllers: [CaiyaAgentController],
})
export class CaiyaAgentModule {}
