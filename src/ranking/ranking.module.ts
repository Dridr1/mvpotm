import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { PrismaService } from 'src/prisma.service';
import { SummonersService } from 'src/summoners/summoners.service';

@Module({
  controllers: [RankingController],
  providers: [RankingService, PrismaService, SummonersService]
})
export class RankingModule {}
