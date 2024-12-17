/*
  Warnings:

  - You are about to drop the `IsUpdating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "IsUpdating";

-- CreateTable
CREATE TABLE "RunData" (
    "id" SERIAL NOT NULL,
    "isUpdating" BOOLEAN NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunData_pkey" PRIMARY KEY ("id")
);
