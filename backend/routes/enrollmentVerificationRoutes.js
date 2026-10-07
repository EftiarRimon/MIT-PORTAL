const bcrypt = require('bcryptjs');
// const express = require('express');
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();
// const router = express.Router();

// router.get('/enrolled', async (req, res) => {
//   const enrolled = await prisma.enrolled.findMany();
//   res.json(enrolled);
// });

// router.post('/student', async (req, res) => {
//   const { registration_number, email, session, name } = req.body;
//   try {
//     const student = await prisma.student.create({
//       data: {
//         registration_number,
//         email,
//         session,
//         name,
//       },
//     });
//     res.json(student);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;
// const express = require('express');
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();
// const router = express.Router();

// router.get('/enrolled', async (req, res) => {
//   try {
//     const enrolled = await prisma.enrolled.findMany();
//     res.json(enrolled);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch enrolled students' });
//   }
// });

// router.post('/students', async (req, res) => {
//   const { registration_number, email, session, name } = req.body;
//   try {
//     const student = await prisma.student.create({
//       data: {
//         registration_number,
//         email,
//         session,
//         name,
//       },
//     });
//     res.json(student);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get enrolled students
router.get('/enrollments', async (req, res) => {
  try {
    const enrolledStudents = await prisma.enrolled.findMany();
    res.json(enrolledStudents);
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Save student
router.post('/students', async (req, res) => {
  try {
    const { registration_number, email, session, name } = req.body;
    
    if (!registration_number || !email || !session || !name) {
      console.error('Validation Error: Missing fields');
      return res.status(400).json({ error: 'All fields are required.' });
    }

    console.log('Received data:', req.body);

   const student = await prisma.student.create({
  data: {
    registration_number,
    email,
    session,
    name,
    role: 'student',
    password: await bcrypt.hash(registration_number, 10),
  },
});
    // user table e add koro so student can login
    await prisma.user.create({
      data: {
        email,
        role: 'student',
        password: await bcrypt.hash(registration_number, 10), // default password = registration_number
      },
    });
    
    res.json(student);
  } catch (error) {
    console.error('Error saving student:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/enrollments/:registration_number', async (req, res) => {
  try {
    await prisma.enrolled.delete({
      where: { registration_number: req.params.registration_number }
    });
    res.json({ message: 'Removed from enrolled list' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing student' });
  }
});

module.exports = router;


