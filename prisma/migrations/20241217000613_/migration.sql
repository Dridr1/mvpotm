/*
  Warnings:

  - You are about to drop the `isUpdating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "isUpdating";

-- CreateTable
CREATE TABLE "IsUpdating" (
    "id" SERIAL NOT NULL,
    "isUpdating" BOOLEAN NOT NULL,

    CONSTRAINT "IsUpdating_pkey" PRIMARY KEY ("id")
);
