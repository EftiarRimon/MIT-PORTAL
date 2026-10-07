const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Same message whether the email is missing or the password is wrong,
    // so nobody can tell if an email exists.
    // Passwords are stored as bcrypt hashes.
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


