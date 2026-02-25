/*
  Warnings:

  - You are about to drop the column `password` on the `student` table. All the data in the column will be lost.
  - Added the required column `semester` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `courseenrollment` ADD COLUMN `semester` VARCHAR(191) NOT NULL,
    ADD COLUMN `session` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `password`,
    ADD COLUMN `session` VARCHAR(255) NOT NULL;
