/*
  Warnings:

  - You are about to drop the column `recieverCpf` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `senderCpf` on the `Block` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_recieverCpf_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_senderCpf_fkey";

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "recieverCpf",
DROP COLUMN "senderCpf",
ADD COLUMN     "reciever" TEXT,
ADD COLUMN     "sender" TEXT;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_sender_fkey" FOREIGN KEY ("sender") REFERENCES "User"("cpf_cnpj") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_reciever_fkey" FOREIGN KEY ("reciever") REFERENCES "User"("cpf_cnpj") ON DELETE SET NULL ON UPDATE CASCADE;
