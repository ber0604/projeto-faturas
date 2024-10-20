-- CreateTable
CREATE TABLE "Fatura" (
    "id" SERIAL NOT NULL,
    "clienteId" TEXT NOT NULL,
    "mesReferencia" TEXT NOT NULL,
    "energiaQuantidadeKwh" INTEGER NOT NULL,
    "energiaValor" DOUBLE PRECISION NOT NULL,
    "contribuicaoIlumPublica" DOUBLE PRECISION,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);
