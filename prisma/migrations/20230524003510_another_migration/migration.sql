/*
  Warnings:

  - A unique constraint covering the columns `[previousBlockId]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "previousBlockId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Block_previousBlockId_key" ON "Block"("previousBlockId");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_previousBlockId_fkey" FOREIGN KEY ("previousBlockId") REFERENCES "Block"("index") ON DELETE SET NULL ON UPDATE CASCADE;
