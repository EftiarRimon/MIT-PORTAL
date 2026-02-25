-- AddForeignKey
ALTER TABLE `CourseEnrollment` ADD CONSTRAINT `CourseEnrollment_coursecode_fkey` FOREIGN KEY (`coursecode`) REFERENCES `Course`(`coursecode`) ON DELETE RESTRICT ON UPDATE CASCADE;
