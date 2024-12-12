import { Injectable } from '@nestjs/common';
import { CreateSummonerDto } from './dto/create-summoner.dto';
import * as api from "../api/api.js";
import { PrismaService } from 'src/prisma.service';
import { Prisma, Summoner } from '@prisma/client';

@Injectable()
export class SummonersService {
  constructor(private prisma:PrismaService) {}

  createConfig() {
    return api.config(process.env.RIOT_TOKEN);
  }

  async create(createSummonerDto: CreateSummonerDto): Promise<Summoner> {
    try {
      const config = this.createConfig();
      const payload = {
        gameName: createSummonerDto.gameName,
        tagLine: createSummonerDto.tagLine
      }
      
      const response = await api.fetchSummonerData(payload, config);
      return this.prisma.summoner.create({data: response.data})

    } catch (error) {
        console.log(error);
    }
  }

  async findAll() {
    return await this.prisma.summoner.findMany();
  }

  async remove(where: Prisma.SummonerWhereUniqueInput) {
    return this.prisma.summoner.delete({where,})
  }
}
