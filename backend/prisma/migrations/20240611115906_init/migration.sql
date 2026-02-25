/*
  Warnings:

  - Made the column `role` on table `staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `staff` MODIFY `role` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `student` MODIFY `role` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `teacher` MODIFY `role` VARCHAR(50) NOT NULL;
