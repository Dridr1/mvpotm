/*
  Warnings:

  - Added the required column `lose` to the `Ranking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wins` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ranking" ADD COLUMN     "lose" INTEGER NOT NULL,
ADD COLUMN     "wins" INTEGER NOT NULL;
