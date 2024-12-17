import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(RankingService.name);

  createConfig() {
    return api.config(process.env.RIOT_TOKEN);
  }

  async create(wins: number, lose: number, winRate: number, gameName: string) {
    try {
      return await this.prisma.ranking.create({ data: { wins: wins, lose: lose, winRate, gameName } })
    } catch (error) {
      this.logger.log(error);
    }
  }

  getWinrate(matches: match[], summonerName?: string) {
    const sortedMatches = matches.sort((a, b) => b.gameEndTimestamp - a.gameEndTimestamp);
    const results = sortedMatches.length > 20 ? sortedMatches.slice(0, 20) : sortedMatches;

    let wins = 0;
    let loses = 0;

    for (const result of results) {
      if (result.win) wins++;
      else loses++;
    }
    const winRate = (wins / (wins + loses)) * 100;
    this.logger.log(`${summonerName}: {Wins: ${wins} Loses: ${loses} Winrate: ${winRate}}`);
    return { wins, loses, winRate };
  }

  // TODO: adicionar cronjob dos rankings
  async updateRanking() {
    try {
      const isUpdating = await this.prisma.runData.findFirst();
      if (isUpdating.isUpdating) {
        this.logger.log("Already updating");
        throw new HttpException("Already updating", HttpStatus.CONFLICT);
      }
      await this.prisma.runData.update({ where: { id: 1 }, data: { isUpdating: true } });


      this.logger.log("Removing old data");
      await this.remove();
      this.logger.log("Started Ranking update");
      const summoners = await this.summonersService.findAll();
      this.logger.log("Summoners list:");
      summoners.forEach(a => this.logger.log(a.gameName));

      for (const summoner of summoners) {
        const soloDuo = await this.findMatches(summoner.puuid, 420);
        const flex = await this.findMatches(summoner.puuid, 440);
        const matches = [...flex, ...soloDuo];
        let matchDetailsArray = [];
        this.logger.log(matches.join(", "));

        for (const match of matches) {
          await delay(DELAY);
          const matchDetails = await api.fechMatchDetails(match, this.createConfig());
          const MatchDetailsByPlayerUuid = matchDetails.data.info.participants.find(({ puuid }) => puuid === summoner.puuid);
          if (matchDetails.data.info.gameDuration < 300) continue;
          matchDetailsArray.push({ win: MatchDetailsByPlayerUuid.win, gameEndTimestamp: matchDetails.data.info.gameEndTimestamp });
        }
        const results = this.getWinrate(matchDetailsArray, summoner.gameName);
        await this.create(results.wins, results.loses, results.winRate, summoner.gameName);
      }
      await this.prisma.runData.update({ where: { id: 1 }, data: { isUpdating: false, lastUpdated: new Date() } });

      this.logger.log("Finished updating Ranking");
      return "Ranking Updated"
    } catch (error) {
      this.logger.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("Something went wrong");
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
    const results = await this.prisma.ranking.findMany({ orderBy: [{ winRate: 'desc' }] });
    const lastUpdated = await this.prisma.runData.findFirst();
    let dateString = lastUpdated.lastUpdated.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Sao_Paulo',
      hour12: false
    }).replace(/\//g, '/').replace(',', ' às');
    this.logger.log("Ranking enviado, ultima atualização: " + lastUpdated.lastUpdated);
    return { results, lastUpdated: dateString };
  }

  async remove() {
    return await this.prisma.$executeRaw`TRUNCATE TABLE "Ranking" RESTART IDENTITY;`;
  }
}
