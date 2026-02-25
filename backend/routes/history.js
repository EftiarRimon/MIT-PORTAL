const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { roll, session } = req.body;
    const data = await prisma.marksheetData.findMany({
      where: {
        student_roll: roll,
        session,
      },
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
////////////////end //////////////