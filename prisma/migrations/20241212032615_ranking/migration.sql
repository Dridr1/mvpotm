-- CreateTable
CREATE TABLE "Ranking" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "gameName" TEXT NOT NULL,
    "kda" TEXT NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);
