/*
  Warnings:

  - You are about to alter the column `tipo` on the `elemento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `nombre` on the `elemento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `nombre` on the `imagen` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `clave` on the `observacion` table. All the data in the column will be lost.
  - You are about to drop the column `observaciones` on the `observacion` table. All the data in the column will be lost.
  - You are about to drop the column `tramo_id` on the `observacion` table. All the data in the column will be lost.
  - You are about to alter the column `kilometro` on the `observacion` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `coordenadas` on the `observacion` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `inicio` on the `tramo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `destino` on the `tramo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the `_elementotoobservacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_imagentoobservacion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `observacionId` to the `Imagen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carril` to the `Observacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cuerpo` to the `Observacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `elementoId` to the `Observacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Observacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha` to the `Observacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observacion` to the `Observacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opservacion_corta` to the `Observacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tramoId` to the `Observacion` table without a default value. This is not possible if the table is not empty.
  - Made the column `recomendaciones` on table `observacion` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_elementotoobservacion` DROP FOREIGN KEY `_ElementoToObservacion_A_fkey`;

-- DropForeignKey
ALTER TABLE `_elementotoobservacion` DROP FOREIGN KEY `_ElementoToObservacion_B_fkey`;

-- DropForeignKey
ALTER TABLE `_imagentoobservacion` DROP FOREIGN KEY `_ImagenToObservacion_A_fkey`;

-- DropForeignKey
ALTER TABLE `_imagentoobservacion` DROP FOREIGN KEY `_ImagenToObservacion_B_fkey`;

-- DropForeignKey
ALTER TABLE `observacion` DROP FOREIGN KEY `Observacion_tramo_id_fkey`;

-- DropIndex
DROP INDEX `Elemento_tipo_key` ON `elemento`;

-- DropIndex
DROP INDEX `Observacion_tramo_id_fkey` ON `observacion`;

-- AlterTable
ALTER TABLE `elemento` MODIFY `tipo` VARCHAR(50) NOT NULL,
    MODIFY `nombre` VARCHAR(100) NOT NULL,
    MODIFY `descripcion` TEXT NULL;

-- AlterTable
ALTER TABLE `imagen` ADD COLUMN `observacionId` INTEGER NOT NULL,
    MODIFY `nombre` VARCHAR(100) NOT NULL,
    MODIFY `ruta` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `observacion` DROP COLUMN `clave`,
    DROP COLUMN `observaciones`,
    DROP COLUMN `tramo_id`,
    ADD COLUMN `carril` VARCHAR(20) NOT NULL,
    ADD COLUMN `cuerpo` VARCHAR(20) NOT NULL,
    ADD COLUMN `elementoId` INTEGER NOT NULL,
    ADD COLUMN `estado` VARCHAR(50) NOT NULL,
    ADD COLUMN `fecha` DATETIME(3) NOT NULL,
    ADD COLUMN `observacion` TEXT NOT NULL,
    ADD COLUMN `opservacion_corta` VARCHAR(255) NOT NULL,
    ADD COLUMN `tramoId` INTEGER NOT NULL,
    MODIFY `kilometro` VARCHAR(50) NOT NULL,
    MODIFY `coordenadas` VARCHAR(100) NULL,
    MODIFY `recomendaciones` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `tramo` MODIFY `inicio` VARCHAR(100) NOT NULL,
    MODIFY `destino` VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE `_elementotoobservacion`;

-- DropTable
DROP TABLE `_imagentoobservacion`;

-- AddForeignKey
ALTER TABLE `Observacion` ADD CONSTRAINT `Observacion_tramoId_fkey` FOREIGN KEY (`tramoId`) REFERENCES `Tramo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Observacion` ADD CONSTRAINT `Observacion_elementoId_fkey` FOREIGN KEY (`elementoId`) REFERENCES `Elemento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imagen` ADD CONSTRAINT `Imagen_observacionId_fkey` FOREIGN KEY (`observacionId`) REFERENCES `Observacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
