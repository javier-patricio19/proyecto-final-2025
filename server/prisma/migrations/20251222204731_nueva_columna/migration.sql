/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Observacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Observacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `observacion` ADD COLUMN `codigo` VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Observacion_codigo_key` ON `Observacion`(`codigo`);
