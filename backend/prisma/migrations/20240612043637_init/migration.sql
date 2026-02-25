/*
  Warnings:

  - The primary key for the `enrolled` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `enrolled` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registration_number]` on the table `enrolled` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `enrolled` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `enrolled` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- CreateIndex
CREATE UNIQUE INDEX `enrolled_registration_number_key` ON `enrolled`(`registration_number`);

-- CreateIndex
CREATE UNIQUE INDEX `enrolled_email_key` ON `enrolled`(`email`);
