-- CreateTable
CREATE TABLE "Block" (
    "index" INTEGER NOT NULL,
    "timestamp" TEXT NOT NULL,
    "previousHash" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "senderCpf" TEXT NOT NULL,
    "recieverCpf" TEXT NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "User" (
    "cpf_cnpj" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("cpf_cnpj")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_index_key" ON "Block"("index");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_senderCpf_fkey" FOREIGN KEY ("senderCpf") REFERENCES "User"("cpf_cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_recieverCpf_fkey" FOREIGN KEY ("recieverCpf") REFERENCES "User"("cpf_cnpj") ON DELETE RESTRICT ON UPDATE CASCADE;
