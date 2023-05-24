/*
  Warnings:

  - You are about to drop the column `reciever` on the `Block` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_reciever_fkey";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "reciever",
ADD COLUMN     "receiver" TEXT;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "User"("cpf_cnpj") ON DELETE SET NULL ON UPDATE CASCADE;
