/*
  Warnings:

  - You are about to drop the column `opservacion_corta` on the `observacion` table. All the data in the column will be lost.
  - Added the required column `observacion_corta` to the `Observacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `observacion` DROP COLUMN `opservacion_corta`,
    ADD COLUMN `observacion_corta` VARCHAR(255) NOT NULL;
