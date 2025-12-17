/*
  Warnings:

  - You are about to drop the column `coordenadas` on the `observacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `observacion` DROP COLUMN `coordenadas`,
    ADD COLUMN `lat` DOUBLE NULL,
    ADD COLUMN `lng` DOUBLE NULL;
