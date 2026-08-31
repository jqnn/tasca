-- AlterTable
ALTER TABLE `account` MODIFY `accountId` TEXT NOT NULL,
    MODIFY `providerId` TEXT NOT NULL,
    MODIFY `accessToken` TEXT NULL,
    MODIFY `refreshToken` TEXT NULL,
    MODIFY `idToken` TEXT NULL,
    MODIFY `scope` TEXT NULL,
    MODIFY `password` TEXT NULL;

-- AlterTable
ALTER TABLE `session` MODIFY `ipAddress` TEXT NULL,
    MODIFY `userAgent` TEXT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `authMethodId` VARCHAR(191) NULL,
    MODIFY `name` TEXT NOT NULL,
    MODIFY `image` TEXT NULL;

-- AlterTable
ALTER TABLE `verification` MODIFY `identifier` TEXT NOT NULL,
    MODIFY `value` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `auth_method` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('LOCAL', 'AD', 'LDAP') NOT NULL DEFAULT 'LOCAL',
    `description` VARCHAR(191) NOT NULL,
    `controllers` VARCHAR(191) NULL,
    `baseDN` VARCHAR(191) NULL,
    `securityType` ENUM('NONE', 'TLS', 'SSL') NULL DEFAULT 'NONE',
    `port` INTEGER NULL DEFAULT 389,
    `userName` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `usersDN` VARCHAR(191) NULL,
    `uidAttribute` VARCHAR(191) NULL,
    `accountSuffix` VARCHAR(191) NULL,

    UNIQUE INDEX `auth_method_description_key`(`description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_authMethodId_fkey` FOREIGN KEY (`authMethodId`) REFERENCES `auth_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
