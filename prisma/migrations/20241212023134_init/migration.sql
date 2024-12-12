-- CreateTable
CREATE TABLE "Summoner" (
    "id" SERIAL NOT NULL,
    "puuid" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,

    CONSTRAINT "Summoner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Summoner_puuid_key" ON "Summoner"("puuid");
