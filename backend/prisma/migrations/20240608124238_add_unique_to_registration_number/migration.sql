/*
  Warnings:

  - A unique constraint covering the columns `[registration_number]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `students_registration_number_key` ON `students`(`registration_number`);
