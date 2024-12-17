import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);
    private static isInitialized = false;

    async onModuleInit() {
        await this.$connect();
        if (!PrismaService.isInitialized) {
            PrismaService.isInitialized = true;
            await this.initializeRunData();
        }
    }
    private async initializeRunData() {
        this.logger.log("Initializing RunData");
        await this.$executeRaw`TRUNCATE TABLE "RunData" RESTART IDENTITY;`;
        await this.runData.create({
            data: {
                isUpdating: false,
                lastUpdated: new Date(),
            }
        });
    }
}