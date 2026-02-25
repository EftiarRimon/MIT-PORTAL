const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getFeeBreakdown,
  getPaymentStatus,
  submitPayment,
  getAllPayments,
  verifyPayment,
} = require('../controllers/paymentController');

const router = express.Router();

// Multer setup for receipt uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'receipt-' + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/payment/fee-breakdown/:roll/:semester/:session', getFeeBreakdown);
router.get('/payment/status/:roll/:semester/:session', getPaymentStatus);
router.post('/payment/submit', upload.single('receipt'), submitPayment);
router.get('/payment/all', getAllPayments);
router.patch('/payment/verify/:id', verifyPayment);

module.exports = router;