-- CreateTable
CREATE TABLE `course` (
    `course_code` VARCHAR(20) NOT NULL,
    `course_name` VARCHAR(255) NULL,

    PRIMARY KEY (`course_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `registration_number` INTEGER NOT NULL,
    `payment_status` VARCHAR(10) NULL,

    PRIMARY KEY (`registration_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `result` (
    `registration_number` INTEGER NOT NULL,
    `marks` DECIMAL(5, 2) NULL,
    `course_name` VARCHAR(255) NULL,
    `CGPA` DECIMAL(3, 2) NULL,

    PRIMARY KEY (`registration_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff` (
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `Password` VARCHAR(255) NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enrolled` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registration_number` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `session` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher` (
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `designation` VARCHAR(100) NULL,
    `password` VARCHAR(255) NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarksheetData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_roll` VARCHAR(191) NOT NULL,
    `course_code` VARCHAR(191) NOT NULL,
    `course_name` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `session` VARCHAR(191) NOT NULL,
    `marks` INTEGER NOT NULL,
    `gpa` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
