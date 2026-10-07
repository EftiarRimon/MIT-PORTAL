const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  // `identifier` is an email (staff/teacher/student) or a student roll number.
  // `email` is still accepted so older clients keep working.
  const raw = req.body.identifier ?? req.body.email;
  const { password } = req.body;

  if (typeof raw !== 'string' || typeof password !== 'string' || !raw.trim() || !password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const identifier = raw.trim();

  try {
    let email = identifier;

    // No "@" means it is a roll number: look up the student's email.
    if (!identifier.includes('@')) {
      const student = await prisma.student.findUnique({
        where: { registration_number: identifier },
        select: { email: true },
      });
      if (!student) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      email = student.email;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Same message for unknown user and wrong password.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const role = user.role;

    let userData;
    if (role === 'staff') {
      userData = await prisma.staff.findUnique({ where: { email } });
    } else if (role === 'student') {
      userData = await prisma.student.findUnique({ where: { email } });
    } else if (role === 'teacher') {
      userData = await prisma.teacher.findUnique({ where: { email } });
    }

    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token, userData });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
