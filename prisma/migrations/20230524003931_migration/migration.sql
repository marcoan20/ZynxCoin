/*
  Warnings:

  - You are about to drop the column `previousBlockId` on the `Block` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_previousBlockId_fkey";

-- DropIndex
DROP INDEX "Block_previousBlockId_key";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "previousBlockId";
