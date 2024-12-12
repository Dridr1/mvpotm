import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SummonersService } from 'src/summoners/summoners.service';
import * as api from "../api/api"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const DELAY = 1500;

@Injectable()
export class RankingService {
  @Inject(SummonersService)
  private readonly summonersService: SummonersService;
  constructor(private prisma: PrismaService) { }

  createConfig() {
    return api.config(process.env.RIOT_TOKEN);
  }

  async create(wins: number, lose: number, winRate: number, gameName: string) {
    try {
      return await this.prisma.ranking.create({data: {wins: wins, lose: lose, winRate, gameName}})
    } catch (error) {
      console.log(error);
    }
  }

  async updateRanking() {
    try {
      await this.remove();
      const summoners = await this.summonersService.findAll();
      for (const summoner of summoners) {
        let wins = 0;
        let lose = 0;
        
        const flex = await this.findMatches(summoner.puuid, 440);
        const soloDuo = await this.findMatches(summoner.puuid, 420);
        const matches = [...soloDuo, ...flex];

        for (const match of matches) {
          await delay(DELAY);
          const matchDetails = await api.fechMatchDetails(match, this.createConfig());
          const MatchDetailsByPlayerUuid = matchDetails.data.info.participants.find(({ puuid }) => puuid === summoner.puuid);
          
          if(matchDetails.data.info.gameDuration < 300) continue;

          if (MatchDetailsByPlayerUuid.win) {
            wins++;
          } else lose++;
        }
        
        const winRate = (wins / (wins + lose)) * 100;
        
        await this.create(wins, lose, winRate, summoner.gameName);
      }
    } catch (error) {

    }
  }

  async findMatches(puuid: string, queue: number) {
    try {
      const response = await api.fetchMatchesByPuuid(puuid, queue,this.createConfig());
      return response.data;
    } catch (error) {

    }
  }

  async findAll() {
    return await this.prisma.ranking.findMany();
  }

  async remove() {
    return await this.prisma.ranking.deleteMany();
  }
}
