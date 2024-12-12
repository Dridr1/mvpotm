import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummonersModule } from './summoners/summoners.module';

import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:".env",
    isGlobal: true
  }),SummonersModule, RankingModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
