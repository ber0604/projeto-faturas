/*
  Warnings:

  - Added the required column `dataVencimento` to the `Fatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fatura" ADD COLUMN     "dataVencimento" TIMESTAMP(3) NOT NULL;
