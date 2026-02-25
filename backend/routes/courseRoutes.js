const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/initial-course-selection', courseController.initialCourseSelection);
router.post('/submit-course-selection', courseController.submitCourseSelection);
router.get('/courses', courseController.getAllCourses);
router.post('/offer-courses', courseController.offerCourses);
router.get('/course-enrollments', courseController.getCourseEnrollments);
router.put('/course-enrollments/:id/finalize', courseController.finalizeEnrollment);
router.put('/course-enrollments/finalize-all', courseController.finalizeAllEnrollments);
router.get('/finalized-courses', courseController.getFinalizedCourses);

// Credit summary for student dashboard
router.get('/credits/summary', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const student = await prisma.student.findUnique({ where: { email: decoded.email } });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const roll = student.registration_number;

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { roll },
      include: { course: true },
      orderBy: { id: 'asc' },
    });

    if (!enrollments.length) {
      return res.json({ completedCredits: 0, enrolledCredits: 0, currentCourses: [] });
    }

    const semesters = [...new Set(enrollments.map(e => e.semester))];
    const latestSemester = semesters[semesters.length - 1];

    const completedCredits = enrollments
      .filter(e => e.semester !== latestSemester && e.status === 'final')
      .reduce((sum, e) => sum + (e.course?.credit || 0), 0);

    const currentCourses = enrollments
      .filter(e => e.semester === latestSemester)
      .map(e => ({
        coursecode: e.coursecode,
        coursename: e.course?.coursename || '',
        type: e.course?.type || '',
        credit: e.course?.credit || 0,
        status: e.status,
        semester: e.semester,
        session: e.session,
      }));

    const enrolledCredits = currentCourses.reduce((sum, c) => sum + c.credit, 0);

    res.json({ completedCredits, enrolledCredits, currentCourses });

  } catch (error) {
    console.error('Error fetching credit summary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;