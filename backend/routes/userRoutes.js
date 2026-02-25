// routes/userRoutes.js
const express = require('express');
const prisma = require('../prisma/prismaClient');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

// Middleware to authenticate the user using JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.user = decoded;
    next();
  });
};

// Get user data
router.get('/user', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
