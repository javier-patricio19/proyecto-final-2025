-- DropForeignKey
ALTER TABLE `imagen` DROP FOREIGN KEY `Imagen_observacionId_fkey`;

-- DropIndex
DROP INDEX `Imagen_observacionId_fkey` ON `imagen`;

-- AddForeignKey
ALTER TABLE `Imagen` ADD CONSTRAINT `Imagen_observacionId_fkey` FOREIGN KEY (`observacionId`) REFERENCES `Observacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
