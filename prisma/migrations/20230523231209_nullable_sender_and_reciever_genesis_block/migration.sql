-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_recieverCpf_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_senderCpf_fkey";

-- AlterTable
ALTER TABLE "Block" ALTER COLUMN "senderCpf" DROP NOT NULL,
ALTER COLUMN "recieverCpf" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_senderCpf_fkey" FOREIGN KEY ("senderCpf") REFERENCES "User"("cpf_cnpj") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_recieverCpf_fkey" FOREIGN KEY ("recieverCpf") REFERENCES "User"("cpf_cnpj") ON DELETE SET NULL ON UPDATE CASCADE;
