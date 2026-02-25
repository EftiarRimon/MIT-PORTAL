// // routes/notices.js

// const express = require('express');
// const router = express.Router();
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// router.get('/', async (req, res) => {
//   try {
//     const notices = await prisma.notices.findMany();
//     res.json(notices);
//   } catch (error) {
//     console.error('Error fetching notices:', error);
//     res.status(500).json({ error: 'Error fetching notices' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const notices = await prisma.notices.findMany();
    res.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Error fetching notices' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    
    const notice = await prisma.notices.create({
      data: { title, description }
    });
    res.json(notice);
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ error: 'Error creating notice' });
  }
});

module.exports = router;