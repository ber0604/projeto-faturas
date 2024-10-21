/*
  Warnings:

  - Added the required column `fileName` to the `Fatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fatura" ADD COLUMN     "fileName" TEXT NOT NULL;
