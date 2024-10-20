/*
  Warnings:

  - You are about to drop the column `eenergiaCompensadaGDValor` on the `Fatura` table. All the data in the column will be lost.
  - Added the required column `energiaCompensadaGDValor` to the `Fatura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorFatura` to the `Fatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fatura" DROP COLUMN "eenergiaCompensadaGDValor",
ADD COLUMN     "energiaCompensadaGDValor" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valorFatura" DOUBLE PRECISION NOT NULL;
