/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Fatura` table. All the data in the column will be lost.
  - Added the required column `eenergiaCompensadaGDValor` to the `Fatura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energiaCompensadaGD` to the `Fatura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energiaSceeSemIcms` to the `Fatura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energiaSceeSemIcmsValor` to the `Fatura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroCliente` to the `Fatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fatura" DROP COLUMN "clienteId",
ADD COLUMN     "eenergiaCompensadaGDValor" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "energiaCompensadaGD" INTEGER NOT NULL,
ADD COLUMN     "energiaSceeSemIcms" INTEGER NOT NULL,
ADD COLUMN     "energiaSceeSemIcmsValor" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "numeroCliente" TEXT NOT NULL;
