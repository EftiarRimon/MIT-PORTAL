const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Existing route — unchanged
router.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email, role } = decoded;
    let userData;

    if (role === 'staff') {
      userData = await prisma.staff.findUnique({ where: { email } });
    } else if (role === 'student') {
      userData = await prisma.student.findUnique({ where: { email } });
    } else if (role === 'teacher') {
      userData = await prisma.teacher.findUnique({ where: { email } });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.json({ userData });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get full student info (roll, session, currentSemester) — used by course/result pages
router.get('/student-info', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const student = await prisma.student.findUnique({
      where: { email: decoded.email },
      select: {
        registration_number: true,
        session: true,
        currentSemester: true,
        name: true,
      }
    });
    return res.json(student);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student's current semester
router.get('/student-semester', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const student = await prisma.student.findUnique({
      where: { email: decoded.email },
      select: { currentSemester: true }
    });
    return res.json({ currentSemester: student?.currentSemester || null });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Save student's selected semester
router.post('/student-semester', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { semester } = req.body;

    await prisma.student.update({
      where: { email: decoded.email },
      data: { currentSemester: semester }
    });
    return res.json({ message: 'Semester saved successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;