-- AlterTable
ALTER TABLE `courseenrollment` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'preliminary';

-- AlterTable
ALTER TABLE `student` ADD COLUMN `currentSemester` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `coursecode` VARCHAR(50) NULL;

-- CreateTable
CREATE TABLE `PaymentSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `session` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `receipt_url` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `verified_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaymentSubmission` ADD CONSTRAINT `PaymentSubmission_registration_number_fkey` FOREIGN KEY (`registration_number`) REFERENCES `student`(`registration_number`) ON DELETE RESTRICT ON UPDATE CASCADE;
