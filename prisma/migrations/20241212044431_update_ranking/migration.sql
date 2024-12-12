/*
  Warnings:

  - You are about to drop the column `kda` on the `Ranking` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Ranking` table. All the data in the column will be lost.
  - Added the required column `winRate` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ranking" DROP COLUMN "kda",
DROP COLUMN "position",
ADD COLUMN     "winRate" DOUBLE PRECISION NOT NULL;
