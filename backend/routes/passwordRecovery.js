const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const router = express.Router();
const prisma = new PrismaClient();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'user_email_address',
    pass: 'password',
  },
});

// Endpoint for password recovery
router.post('/recover-password', async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  // Generate new password
  const newPassword = Math.random().toString(36).slice(-8);

  // Update the user's password in the database
  await prisma.user.update({
    where: { email },
    data: { password: newPassword },
  });

  // Send the new password via email
  const mailOptions = {
    from: 'akterfariadu2020@gmail.com',
    to: email,
    subject: 'Password Recovery',
    text: `Your new password is ${newPassword}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ error: 'Failed to send email' });
    }
    res.send({ message: 'Password recovery email sent' });
  });
});

module.exports = router;