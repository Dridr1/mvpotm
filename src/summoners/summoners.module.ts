import { Module } from '@nestjs/common';
import { SummonersService } from './summoners.service';
import { SummonersController } from './summoners.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SummonersController],
  providers: [SummonersService, PrismaService],
  exports: [SummonersService]
})
export class SummonersModule {}
