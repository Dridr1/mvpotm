import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RankingService } from './ranking.service';


@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Post()
  updateRanking() {
    return this.rankingService.updateRanking();
  }

  // @Get('matches')
  // findMatches(){
  //   return this.rankingService.findMatches();
  // }

  @Get()
  findAll() {
    return this.rankingService.findAll();
  }
}
