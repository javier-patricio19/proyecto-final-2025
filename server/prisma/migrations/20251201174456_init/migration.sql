-- CreateTable
CREATE TABLE `Tramo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inicio` VARCHAR(191) NOT NULL,
    `destino` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Elemento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Elemento_tipo_key`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Imagen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `ruta` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Observacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clave` VARCHAR(191) NOT NULL,
    `kilometro` VARCHAR(191) NOT NULL,
    `coordenadas` VARCHAR(191) NOT NULL,
    `observaciones` VARCHAR(191) NULL,
    `recomendaciones` VARCHAR(191) NULL,
    `tramo_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ElementoToObservacion` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ElementoToObservacion_AB_unique`(`A`, `B`),
    INDEX `_ElementoToObservacion_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ImagenToObservacion` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ImagenToObservacion_AB_unique`(`A`, `B`),
    INDEX `_ImagenToObservacion_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Observacion` ADD CONSTRAINT `Observacion_tramo_id_fkey` FOREIGN KEY (`tramo_id`) REFERENCES `Tramo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ElementoToObservacion` ADD CONSTRAINT `_ElementoToObservacion_A_fkey` FOREIGN KEY (`A`) REFERENCES `Elemento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ElementoToObservacion` ADD CONSTRAINT `_ElementoToObservacion_B_fkey` FOREIGN KEY (`B`) REFERENCES `Observacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ImagenToObservacion` ADD CONSTRAINT `_ImagenToObservacion_A_fkey` FOREIGN KEY (`A`) REFERENCES `Imagen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ImagenToObservacion` ADD CONSTRAINT `_ImagenToObservacion_B_fkey` FOREIGN KEY (`B`) REFERENCES `Observacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
