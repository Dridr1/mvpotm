import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SummonersService } from 'src/summoners/summoners.service';
import * as api from "../api/api"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const DELAY = 1500;

type match = {
  win: boolean,
  gameEndTimestamp: number,
};

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
      return await this.prisma.ranking.create({ data: { wins: wins, lose: lose, winRate, gameName } })
    } catch (error) {
      console.log(error);
    }
  }

  getWinrate(matches: match[]) {
    //sorting
    const sortedMatches = matches.sort((a, b) => b.gameEndTimestamp - a.gameEndTimestamp);
    const results = sortedMatches.length > 20 ? sortedMatches.slice(0, 20) : sortedMatches;
    
    //geting winrate
    let wins = 0;
    let loses = 0;

    for (const result of results) {
      if (result.win) wins++;
      else loses++;  
    }
    const winRate = (wins / (wins + loses)) * 100;

    //return wins, loses and win-rate
    return {wins, loses, winRate};
  }

  // TODO: adicionar cronjob dos rankings
  async updateRanking() {
    try {
      await this.remove();
      const summoners = await this.summonersService.findAll();
      for (const summoner of summoners) {
        const flex = await this.findMatches(summoner.puuid, 440);
        const soloDuo = await this.findMatches(summoner.puuid, 420);
        const matches = [...soloDuo, ...flex];
        let matchDetailsArray = [];
        
        for (const match of matches) {
          await delay(DELAY);
          const matchDetails = await api.fechMatchDetails(match, this.createConfig());
          const MatchDetailsByPlayerUuid = matchDetails.data.info.participants.find(({ puuid }) => puuid === summoner.puuid);
          if (matchDetails.data.info.gameDuration < 300) continue;
          matchDetailsArray.push({win: MatchDetailsByPlayerUuid.win, gameEndTimestamp: matchDetails.data.info.gameEndTimestamp});
          console.log(matchDetailsArray);
        }
        const results = this.getWinrate(matchDetailsArray);

        await this.create(results.wins, results.loses, results.winRate, summoner.gameName);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findMatches(puuid: string, queue: number) {
    try {
      const response = await api.fetchMatchesByPuuid(puuid, queue, this.createConfig());
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
