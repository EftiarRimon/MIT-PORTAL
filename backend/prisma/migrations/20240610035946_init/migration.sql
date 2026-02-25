/*
  Warnings:

  - The primary key for the `course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `course_code` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `course_name` on the `course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[coursecode]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coursecode` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coursename` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` DROP PRIMARY KEY,
    DROP COLUMN `course_code`,
    DROP COLUMN `course_name`,
    ADD COLUMN `coursecode` VARCHAR(191) NOT NULL,
    ADD COLUMN `coursename` VARCHAR(191) NOT NULL,
    ADD COLUMN `credit` INTEGER NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `CourseEnrollment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roll` VARCHAR(191) NOT NULL,
    `coursecode` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelectedCourse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `coursecode` VARCHAR(191) NOT NULL,
    `currentlyEnrolled` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Course_coursecode_key` ON `Course`(`coursecode`);
