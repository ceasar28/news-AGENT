import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CaiyaAgentModule } from './caiya-agent/caiya-agent.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, CaiyaAgentModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
