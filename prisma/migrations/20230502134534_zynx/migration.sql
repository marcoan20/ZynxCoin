-- CreateTable
CREATE TABLE "Block" (
    "index" INTEGER NOT NULL,
    "timestamp" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "previousHash" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("index")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_index_key" ON "Block"("index");
