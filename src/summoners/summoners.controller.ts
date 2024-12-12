import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SummonersService } from './summoners.service';
import { CreateSummonerDto } from './dto/create-summoner.dto';
import { UpdateSummonerDto } from './dto/update-summoner.dto';
import { Prisma } from '@prisma/client';

@Controller('summoners')
export class SummonersController {
  constructor(private readonly summonersService: SummonersService) {}

  @Post()
  create(@Body() createSummonerDto: CreateSummonerDto) {
    return this.summonersService.create(createSummonerDto);
  }

  @Get()
  findAll() {
    return this.summonersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') where: Prisma.SummonerWhereUniqueInput) {
    return this.summonersService.remove(where);
  }
}
