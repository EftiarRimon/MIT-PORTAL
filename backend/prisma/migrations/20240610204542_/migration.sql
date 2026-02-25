/*
  Warnings:

  - The primary key for the `course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `course` table. All the data in the column will be lost.
  - The primary key for the `result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[registration_number]` on the table `result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`coursecode`);

-- AlterTable
ALTER TABLE `result` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `students`;

-- CreateTable
CREATE TABLE `student` (
    `registration_number` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,

    UNIQUE INDEX `student_registration_number_key`(`registration_number`),
    UNIQUE INDEX `student_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `result_registration_number_key` ON `result`(`registration_number`);

-- CreateIndex
CREATE UNIQUE INDEX `teacher_email_key` ON `teacher`(`email`);

-- AddForeignKey
ALTER TABLE `CourseEnrollment` ADD CONSTRAINT `CourseEnrollment_roll_fkey` FOREIGN KEY (`roll`) REFERENCES `student`(`registration_number`) ON DELETE RESTRICT ON UPDATE CASCADE;
